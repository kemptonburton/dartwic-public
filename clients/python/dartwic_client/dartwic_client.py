"""Simple DARTWIC helpers with intuitive return shapes."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional

from ._tempest import TempestClient, TempestResponse
import threading
import re
from . import MIN_ENGINE_VERSION


def _normalize_comparable_version(value: str) -> List[Any]:
    match = re.fullmatch(r"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?", str(value or "").strip())
    if not match:
        raise ValueError("Invalid engine version: " + str(value))
    pre = match[4]
    identifiers = []
    for part in pre.split(".") if pre else []:
        if part.isdigit() and len(part) > 1 and part[0] == "0":
            raise ValueError("Invalid numeric prerelease identifier")
        identifiers.append((0, int(part)) if part.isdigit() else (1, part))
    return [*(int(match[n]) for n in (1, 2, 3)), 0 if pre else 1, identifiers]


def _compare_versions(left: str, right: str) -> int:
    left_parts = _normalize_comparable_version(left)
    right_parts = _normalize_comparable_version(right)
    return (left_parts > right_parts) - (left_parts < right_parts)


def _is_version_at_least(current_version: str, minimum_version: str) -> bool:
    normalized_minimum = str(minimum_version or "").strip()
    if not normalized_minimum:
        return True

    try:
        return _compare_versions(current_version, normalized_minimum) >= 0
    except ValueError:
        return False


class DartwicClient:
    """Client for DARTWIC operations and common RAPID channel queries."""

    def __init__(self, tempest_client: Optional[TempestClient] = None) -> None:
        """Create a client around a new or existing TEMPEST connection.

        Args:
            tempest_client: Existing TEMPEST client to reuse. A new client is created when omitted.
        """
        self.tempest = tempest_client or TempestClient()
        # Keep TEMPEST's dedicated control-plane heartbeat; connect verifies
        # DARTWIC compatibility separately from protocol liveness.
        self._subscriptions = {}
        self._subscription_lock = threading.RLock()

    def connect(self, ip: str = "127.0.0.1", port: int = 7000, password: str = "") -> TempestResponse:
        """Connect to an engine and verify client compatibility.

        Args:
            ip: Engine host name or IP address.
            port: TEMPEST server port.
            password: Engine connection password.

        Returns:
            The TEMPEST connection response.

        Raises:
            RuntimeError: The connected engine is older than the client's minimum supported version.
        """
        from . import __version__

        if not self.tempest.running and self._subscriptions:
            self.disconnect()

        response = self.tempest.connect(ip, port, password, {
            "dartwic_client_type": "python",
            "dartwic_client_version": __version__,
        })
        try:
            response.raise_for_error()
            runtime_metadata = self.operation("dartwic/get-runtime-metadata")
            runtime_metadata.raise_for_error()
            self._assert_runtime_compatibility(runtime_metadata.payload)
        except Exception:
            self.tempest.disconnect()
            raise
        return response

    def disconnect(self) -> TempestResponse:
        """Disconnect from the engine and return the TEMPEST response."""
        if threading.current_thread() is getattr(self.tempest, "_telemetry_thread", None):
            raise RuntimeError("Disconnect outside telemetry callbacks")
        with self._subscription_lock:
            for channel, entries in self._subscriptions.items():
                for receive in entries.values():
                    self.tempest.unbind_telemetry_handler("rapid/channels/snapshot", receive)
            self._subscriptions.clear()
        return self.tempest.disconnect()

    def is_connected(self) -> bool:
        """Return local connection state; heartbeat failures clear it. This is not a network probe."""
        return self.tempest.running

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.disconnect()

    def get_channels(self, channels: Iterable[str]) -> Dict[str, Any]:
        """Read a batch of live channel records, including explicit exists flags.

        Args:
            channels: Nonempty sequence of flat channel keys, without pipes.

        Returns:
        Records keyed by channel name with the full stored value.
        """
        response = self.operation("rapid/get-channels-data", {"channel_names": self._channel_list(channels)})
        response.raise_for_error()
        return response.payload["channels"]

    def query_channel(self, channel: str, field: str = "value") -> Any:
        """Read one field of a live channel; a missing channel or field raises KeyError.

        Args:
            channel: Flat channel key, without pipes.
            field: Field to read, defaulting to value.

        Returns:
            The field value. Live numeric values are rounded by the engine to three decimals.
        """
        record = self.get_channels([channel]).get(channel, {})
        if not record.get("exists"):
            raise KeyError(channel)
        return record["channel_data"][field]

    def upsert_channel(self, channel: str, value: Any, field: str = "value") -> None:
        """Write a typed channel field subject to engine authority; does not take manual override.

        Args:
            channel: Flat channel key, without pipes.
            value: Numeric value or the selected metadata field's JSON value.
            field: Field to write, defaulting to value.
        """
        self.operation("rapid/upsert-channel-field", {"channel_name": channel, "field": field, "value": value}).raise_for_error()

    def subscribe_telemetry(self, prefix: str, handler: Any) -> Any:
        """Bind raw TEMPEST telemetry locally and return an idempotent unsubscribe function.

        Args:
            prefix: Topic prefix to match. This does not enable engine channel streaming.
            handler: Callback receiving the wire telemetry dictionary and unmatched topic suffix. Runs on the receive thread.

        Returns:
            A callable removing this binding. Keep callbacks short; exceptions are logged and isolated.
        """
        self.tempest.bind_telemetry_handler(prefix, handler)
        return lambda: self.tempest.unbind_telemetry_handler(prefix, handler)

    def subscribe_channel(self, channel: str, handler: Any) -> Any:
        """Enable a channel stream, deliver its initial snapshot, and return an unsubscribe function.

        Args:
            channel: Exact flat channel name; similarly prefixed names are not dispatched.
            handler: Callback receiving the channel snapshot dictionary. Initial delivery occurs on the caller; updates on the telemetry thread.

        Returns:
            Idempotent unsubscribe callable. Disconnect removes server subscriptions; subscribe again after reconnecting.
        """
        self._channel_list([channel])
        if not callable(handler):
            raise TypeError("handler must be callable")
        topic = "rapid/channels/snapshot"
        token = object()
        def receive(message, suffix):
            if not suffix:
                record = message.get("payload", {}).get("channels", {}).get(channel)
                if record is not None:
                    handler(record)
        with self._subscription_lock:
            first = not self._subscriptions.get(channel)
            self.tempest.bind_telemetry_handler(topic, receive)
            try:
                response = self.operation("dartwic/add-channel-to-telemetry", {"channel_name": channel}) if first else None
                if response:
                    response.raise_for_error()
                self._subscriptions.setdefault(channel, {})[token] = receive
            except Exception:
                self.tempest.unbind_telemetry_handler(topic, receive)
                raise
        def unsubscribe():
            with self._subscription_lock:
                entries = self._subscriptions.get(channel, {})
                if token not in entries:
                    return
                # Retain the subscription if the server removal fails, allowing a retry.
                if len(entries) == 1 and self.is_connected():
                    self.operation("dartwic/remove-channel-from-telemetry", {"channel_name": channel}).raise_for_error()
                entries.pop(token)
                self.tempest.unbind_telemetry_handler(topic, receive)
                if not entries:
                    self._subscriptions.pop(channel, None)
        try:
            if response:
                handler(response.payload["snapshot"])
            else:
                handler({"channel_name": channel, **self.get_channels([channel])[channel]})
        except Exception:
            unsubscribe()
            raise
        return unsubscribe

    @staticmethod
    def _channel_list(channels):
        if isinstance(channels, str):
            raise TypeError("Pass a sequence of channel names, not one string")
        result = list(channels)
        if not result or any(not isinstance(name, str) or not name for name in result):
            raise ValueError("At least one nonempty channel name is required")
        return result

    def operation(self, name: str, payload: Optional[Dict[str, Any]] = None, timeout_ms: int = 5000) -> TempestResponse:
        """Call a TEMPEST operation.

        Args:
            name: Exact operation name.
            payload: Operation-specific request payload.
            timeout_ms: Client-side timeout in milliseconds.

        Returns:
            The TEMPEST operation response.
        """
        return self.tempest.operation(name, payload or {}, timeout_ms)

    def list_dataframes(self) -> Dict[str, Any]:
        """Return saved dataframe views indexed by their stable IDs."""
        response = self.operation("rapid/dataframes/list", {}, timeout_ms=5000)
        response.raise_for_error()
        return {str(frame["id"]): frame for frame in response.payload.get("frames", [])}

    def get_channel_keys(self, query: str = "", limit: int = 1000) -> Dict[str, Any]:
        """Search RAPID channel keys.

        Args:
            query: Text used to filter channel keys.
            limit: Maximum number of matches.

        Returns:
            The normalized query and matching channel keys.
        """
        response = self.operation(
            "rapid/search-channel-keys",
            {"query": query, "limit": limit},
            timeout_ms=5000,
        )
        response.raise_for_error()

        channels = list(response.payload.get("query_results", []))
        return {
            "query": response.payload.get("query", query),
            "channels": channels,
        }

    def query_channel_range(
        self,
        series: Iterable[str],
        from_timestamp: Optional[int] = None,
        to_timestamp: Optional[int] = None,
        bucket_count: Optional[int] = None,
        timeout_ms: int = 10000,
        bucket_mode: str = "average",
    ) -> Dict[str, Any]:
        """Query recorded values for one or more channel series.

        Args:
            series: Channel references to query.
            from_timestamp: Inclusive lower timestamp bound in nanoseconds.
            to_timestamp: Inclusive upper timestamp bound in nanoseconds.
            bucket_count: Optional number of aggregation buckets.
            timeout_ms: Client-side timeout in milliseconds.
            bucket_mode: average or extrema; meaningful when bucket_count is positive.

        Returns:
            Channel points and aggregate query statistics.
        """
        payload: Dict[str, Any] = {
            "series": self._channel_list(series),
        }
        if from_timestamp is not None:
            payload["from"] = from_timestamp
        if to_timestamp is not None:
            payload["to"] = to_timestamp
        if from_timestamp is not None and to_timestamp is not None and from_timestamp > to_timestamp:
            raise ValueError("from_timestamp must not exceed to_timestamp")
        if bucket_mode not in ("average", "extrema") or (bucket_count is not None and bucket_count < 0):
            raise ValueError("Invalid bucket mode or count")
        if bucket_count is not None:
            payload["bucket_count"] = bucket_count
            payload["bucket_mode"] = bucket_mode

        response = self.operation("rapid/query-channel-range", payload, timeout_ms=timeout_ms)
        response.raise_for_error()

        channels: Dict[str, Dict[str, Any]] = {}
        for item in response.payload.get("channels", []):
            channel_reference = str(item.get("channel_reference", ""))
            points = list(item.get("points", []))
            timestamps = [int(point["timestamp"]) for point in points]
            values = [float(point["value"]) for point in points]
            datetimes = [
                datetime.fromtimestamp(timestamp / 1_000_000_000, tz=timezone.utc)
                for timestamp in timestamps
            ]

            channels[channel_reference] = {
                "channel_reference": channel_reference,
                "points": points,
                "timestamps": timestamps,
                "values": values,
                "datetimes": datetimes,
                "point_count": int(item.get("point_count", len(points))),
                "raw_point_count": int(item.get("raw_point_count", len(points))),
            }

        return {
            **response.payload,
            "channels": channels,
            "bucketed": bool(response.payload.get("bucketed", False)),
            "bucket_count": response.payload.get("bucket_count"),
            "total_points": int(response.payload.get("total_points", 0)),
            "total_raw_points": int(response.payload.get("total_raw_points", 0)),
            "query_seconds": float(response.payload.get("query_seconds", 0.0)),
        }

    @staticmethod
    def _to_int_or_none(value: Any) -> Optional[int]:
        if value is None:
            return None
        return int(value)

    @staticmethod
    def _assert_runtime_compatibility(runtime_metadata: Dict[str, Any]) -> None:
        engine_version = str(runtime_metadata.get("engineVersion", "")).strip()
        if not _is_version_at_least(engine_version, MIN_ENGINE_VERSION):
            raise RuntimeError(
                f"This Python client requires DARTWIC engine {MIN_ENGINE_VERSION} or newer. "
                f"Connected engine version was {engine_version or 'unknown'}."
            )
