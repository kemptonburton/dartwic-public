"""Bare Python TEMPEST ZeroMQ client."""

from __future__ import annotations

import json
import logging
import threading
import time
from dataclasses import dataclass
from typing import Any, Callable, Dict, Optional, Set

import zmq
from .internal_versions import TEMPEST_COMPATIBILITY_VERSION


TelemetryHandler = Callable[[Dict[str, Any], str], None]


class TempestError(RuntimeError):
    """Raised when a TEMPEST request fails and strict mode is enabled."""


@dataclass(slots=True)
class TempestResponse:
    client_id: str
    name: str
    error: bool
    payload: Dict[str, Any]
    timestamp: int

    @classmethod
    def from_dict(cls, data: Dict[str, Any], fallback_client_id: str, fallback_name: str) -> "TempestResponse":
        return cls(
            client_id=str(data.get("clientId", fallback_client_id) or ""),
            name=str(data.get("name", fallback_name) or ""),
            error=bool(data.get("error", False)),
            payload=data.get("payload", {}) or {},
            timestamp=int(data.get("timestamp", int(time.time() * 1000))),
        )

    def raise_for_error(self) -> "TempestResponse":
        if self.error:
            raise TempestError(str(self.payload.get("error", "Unknown TEMPEST error")))
        return self


class TempestClient:
    """Synchronous ZeroMQ TEMPEST client with optional heartbeat and telemetry."""

    def __init__(
        self,
        implement_heartbeat: bool = True,
        logger: Optional[logging.Logger] = None,
    ) -> None:
        self.logger = logger or logging.getLogger(__name__)
        self.implement_heartbeat = implement_heartbeat
        self.heartbeat_operation = "heartbeat"

        self.operation_endpoint = ""
        self.telemetry_endpoint = ""
        self.client_id = ""
        self.session_token = ""
        self.server_password = ""
        self.running = False

        self._context = zmq.Context.instance()
        self._telemetry_handlers: Dict[str, Set[TelemetryHandler]] = {}
        self._telemetry_socket: Optional[zmq.Socket] = None
        self._telemetry_thread: Optional[threading.Thread] = None
        self._heartbeat_thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self._handler_lock = threading.Lock()

    def bind_telemetry_handler(self, topic_prefix: str, handler: TelemetryHandler) -> None:
        with self._handler_lock:
            handlers = self._telemetry_handlers.setdefault(topic_prefix, set())
            handlers.add(handler)

        # SUB is owned exclusively by its receive thread. Local prefix filtering
        # permits handlers to be changed without touching another thread's socket.

    def unbind_telemetry_handler(self, topic_prefix: str, handler: Optional[TelemetryHandler] = None) -> None:
        with self._handler_lock:
            if topic_prefix not in self._telemetry_handlers:
                return

            if handler is None:
                del self._telemetry_handlers[topic_prefix]
            else:
                handlers = self._telemetry_handlers[topic_prefix]
                handlers.discard(handler)
                if not handlers:
                    del self._telemetry_handlers[topic_prefix]

    def connect(
        self,
        tempest_ip: str,
        tempest_port: int,
        server_password: str,
        client_metadata: Optional[Dict[str, Any]] = None,
    ) -> TempestResponse:
        if self.running:
            return TempestResponse(self.client_id, "register_client", False, {"message": "Already connected"}, int(time.time() * 1000))
        if self.client_id:
            self.disconnect()

        self.operation_endpoint = f"tcp://{tempest_ip}:{tempest_port}"
        self.telemetry_endpoint = f"tcp://{tempest_ip}:{tempest_port + 1}"
        self.server_password = server_password
        self.running = True
        self._stop_event.clear()

        register_payload = {}
        if client_metadata and isinstance(client_metadata, dict):
            register_payload.update(client_metadata)
        register_payload["serverPassword"] = self.server_password
        register_payload["tempestCompatibilityVersion"] = TEMPEST_COMPATIBILITY_VERSION

        response = self.operation("register_client", register_payload)
        if response.error:
            self.running = False
            return response

        self.client_id = str(response.payload.get("clientId", ""))
        self.session_token = str(response.payload.get("sessionToken", ""))
        if not self.client_id:
            self.running = False
            response.error = True
            response.payload = {"error": "Registration did not return a client id"}
            return response
        self._start_heartbeat()
        self._start_telemetry()
        return response

    def disconnect(self) -> TempestResponse:
        if threading.current_thread() is self._telemetry_thread:
            raise RuntimeError("Disconnect outside telemetry callbacks")
        self.running = False
        self._stop_event.set()

        for thread in (self._telemetry_thread, self._heartbeat_thread):
            if thread and thread is not threading.current_thread():
                thread.join()

        response = (self.operation("unregister_client", {}, 1000) if self.client_id else
                    TempestResponse("", "unregister_client", False, {}, int(time.time() * 1000)))
        self.client_id = ""
        self.session_token = ""
        return response

    def operation(self, name: str, payload: Optional[Dict[str, Any]] = None, timeout_ms: int = 3000) -> TempestResponse:
        if timeout_ms <= 0:
            raise ValueError("timeout_ms must be positive")
        if not self.operation_endpoint or (not self.running and name not in ("register_client", "unregister_client")):
            return TempestResponse("", name, True, {"error": "Client is disconnected"}, int(time.time() * 1000))
        return self._send(zmq.DEALER, self.operation_endpoint, name, payload or {}, timeout_ms)

    def _send(
        self,
        socket_type: int,
        endpoint: str,
        name: str,
        payload: Dict[str, Any],
        timeout_ms: int,
    ) -> TempestResponse:
        socket = self._context.socket(socket_type)
        socket.setsockopt(zmq.LINGER, 0)
        timestamp = int(time.time() * 1000)

        request = {
            "clientId": self.client_id,
            "sessionToken": self.session_token,
            "name": name,
            "payload": payload,
            "timestamp": timestamp,
        }

        try:
            socket.connect(endpoint)
            socket.send_string(json.dumps(request))

            if socket.poll(timeout_ms, zmq.POLLIN) == 0:
                raise TimeoutError("Request timeout")

            response_raw = socket.recv_string()
            response_json = json.loads(response_raw)
            return TempestResponse.from_dict(response_json, self.client_id, name)
        except Exception as exc:
            return TempestResponse(
                client_id=self.client_id,
                name=name,
                error=True,
                payload={"error": self._format_error_message(name, str(exc))},
                timestamp=timestamp,
            )
        finally:
            socket.close(linger=0)

    def _start_heartbeat(self, interval_ms: int = 5000) -> None:
        if not self.implement_heartbeat:
            return

        def run() -> None:
            while not self._stop_event.wait(interval_ms / 1000.0):
                if not self.running:
                    continue
                response = self.operation(self.heartbeat_operation, {}, timeout_ms=1000)
                if response.error:
                    self.running = False
                    self._stop_event.set()

        self._heartbeat_thread = threading.Thread(target=run, name="tempest-heartbeat", daemon=True)
        self._heartbeat_thread.start()

    def _start_telemetry(self) -> None:
        def run() -> None:
            socket = self._context.socket(zmq.SUB)
            socket.setsockopt(zmq.LINGER, 0)
            socket.setsockopt(zmq.RCVTIMEO, 500)
            socket.connect(self.telemetry_endpoint)

            socket.setsockopt_string(zmq.SUBSCRIBE, "")

            self._telemetry_socket = socket
            self.logger.info(self._format_message(f"Telemetry awaiting: {self.telemetry_endpoint}"))

            while not self._stop_event.is_set():
                try:
                    frames = socket.recv_multipart()
                    if len(frames) != 2:
                        self.logger.warning("Ignoring malformed TEMPEST telemetry frames")
                        continue
                    topic_bytes, message_bytes = frames
                except zmq.Again:
                    continue
                except zmq.ZMQError:
                    break

                try:
                    telemetry = json.loads(message_bytes.decode("utf-8"))
                    if not isinstance(telemetry, dict):
                        raise ValueError("Telemetry must be an object")
                    topic = telemetry.get("topic", topic_bytes.decode("utf-8"))
                    if not isinstance(topic, str):
                        raise ValueError("Telemetry topic must be a string")
                    payload = telemetry.get("payload")
                    target_client_id = payload.get("client_id") if isinstance(payload, dict) else None
                    if target_client_id and target_client_id != self.client_id:
                        continue
                except (ValueError, UnicodeDecodeError) as exc:
                    self.logger.warning(self._format_message(f"Tempest telemetry parse error: {exc}"))
                    continue

                with self._handler_lock:
                    handler_items = [(prefix, tuple(handlers)) for prefix, handlers in self._telemetry_handlers.items()]

                for prefix, handlers in handler_items:
                    telemetry_topic = topic
                    if telemetry_topic.startswith(prefix):
                        remainder = telemetry_topic[len(prefix):]
                        for handler in list(handlers):
                            try:
                                handler(telemetry, remainder)
                            except Exception as exc:
                                self.logger.warning(self._format_message(f"Handler error for {prefix}: {exc}"))

            self._stop_telemetry_socket()

        self._telemetry_thread = threading.Thread(target=run, name="tempest-telemetry", daemon=True)
        self._telemetry_thread.start()

    def _stop_telemetry_socket(self) -> None:
        socket = self._telemetry_socket
        self._telemetry_socket = None
        if socket is not None:
            try:
                socket.close(linger=0)
            except zmq.ZMQError:
                pass

    @staticmethod
    def _format_error_message(name: str, error_message: str) -> str:
        return f"[TEMPEST CLIENT] Error for ({name}), Err: {error_message or 'Unknown error'}"

    @staticmethod
    def _format_message(message: str) -> str:
        return f"[TEMPEST CLIENT] {message}"
