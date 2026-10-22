---
title: DartwicClient
summary: Client for DARTWIC operations and common RAPID channel queries.
created: 2026-08-03T15:41
updated: 2026-10-14T22:39
---

## Constructor

Create a client around a new or existing TEMPEST connection.

```python
def __init__(self, tempest_client: Optional[TempestClient] = None) -> None
```

| Name | Description |
| --- | --- |
| `tempest_client` | Existing TEMPEST client to reuse. A new client is created when omitted. |

## Methods

### connect

Connect to an engine and verify client compatibility.

```python
def connect(self, ip: str = "127.0.0.1", port: int = 7000, password: str = "") -> TempestResponse
```

#### Parameters

| Name | Description |
| --- | --- |
| `ip` | Engine host name or IP address. |
| `port` | TEMPEST server port. |
| `password` | Engine connection password. |

#### Returns

The TEMPEST connection response.

#### Raises

| Exception | When |
| --- | --- |
| `RuntimeError` | The connected engine is older than the client's minimum supported version. |

### disconnect

Disconnect from the engine and return the TEMPEST response.

```python
def disconnect(self) -> TempestResponse
```

### is_connected

Return local connection state; heartbeat failures clear it. This is not a network probe.

```python
def is_connected(self) -> bool
```

### get_channels

Read a batch of live channel records, including explicit exists flags.

```python
def get_channels(self, channels: Iterable[str]) -> Dict[str, Any]
```

#### Parameters

| Name | Description |
| --- | --- |
| `channels` | Nonempty sequence of flat channel keys, without pipes. |

#### Returns

Records keyed by channel name with the full stored value.

### query_channel

Read one field of a live channel; a missing channel or field raises KeyError.

```python
def query_channel(self, channel: str, field: str = "value") -> Any
```

#### Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel key, without pipes. |
| `field` | Field to read, defaulting to value. |

#### Returns

The field value. Live numeric values are rounded by the engine to three decimals.

### upsert_channel

Write a typed channel field subject to engine authority; does not take manual override.

```python
def upsert_channel(self, channel: str, value: Any, field: str = "value") -> None
```

#### Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel key, without pipes. |
| `value` | Numeric value or the selected metadata field's JSON value. |
| `field` | Field to write, defaulting to value. |

### subscribe_telemetry

Bind raw TEMPEST telemetry locally and return an idempotent unsubscribe function.

```python
def subscribe_telemetry(self, prefix: str, handler: Any) -> Any
```

#### Parameters

| Name | Description |
| --- | --- |
| `prefix` | Topic prefix to match. This does not enable engine channel streaming. |
| `handler` | Callback receiving the wire telemetry dictionary and unmatched topic suffix. Runs on the receive thread. |

#### Returns

A callable removing this binding. Keep callbacks short; exceptions are logged and isolated.

### subscribe_channel

Enable a channel stream, deliver its initial snapshot, and return an unsubscribe function.

```python
def subscribe_channel(self, channel: str, handler: Any) -> Any
```

#### Parameters

| Name | Description |
| --- | --- |
| `channel` | Exact flat channel name; similarly prefixed names are not dispatched. |
| `handler` | Callback receiving the channel snapshot dictionary. Initial delivery occurs on the caller; updates on the telemetry thread. |

#### Returns

Idempotent unsubscribe callable. Disconnect removes server subscriptions; subscribe again after reconnecting.

### operation

Call a TEMPEST operation.

```python
def operation(self, name: str, payload: Optional[Dict[str, Any]] = None, timeout_ms: int = 5000) -> TempestResponse
```

#### Parameters

| Name | Description |
| --- | --- |
| `name` | Exact operation name. |
| `payload` | Operation-specific request payload. |
| `timeout_ms` | Client-side timeout in milliseconds. |

#### Returns

The TEMPEST operation response.

### list_dataframes

Return saved dataframe views indexed by their stable IDs.

```python
def list_dataframes(self) -> Dict[str, Any]
```

### get_channel_keys

Search RAPID channel keys.

```python
def get_channel_keys(self, query: str = "", limit: int = 1000) -> Dict[str, Any]
```

#### Parameters

| Name | Description |
| --- | --- |
| `query` | Text used to filter channel keys. |
| `limit` | Maximum number of matches. |

#### Returns

The normalized query and matching channel keys.

### query_channel_range

Query recorded values for one or more channel series.

```python
def query_channel_range(
    self,
    series: Iterable[str],
    from_timestamp: Optional[int] = None,
    to_timestamp: Optional[int] = None,
    bucket_count: Optional[int] = None,
    timeout_ms: int = 10000,
    bucket_mode: str = "average",
) -> Dict[str, Any]
```

#### Parameters

| Name | Description |
| --- | --- |
| `series` | Channel references to query. |
| `from_timestamp` | Inclusive lower timestamp bound in nanoseconds. |
| `to_timestamp` | Inclusive upper timestamp bound in nanoseconds. |
| `bucket_count` | Optional number of aggregation buckets. |
| `timeout_ms` | Client-side timeout in milliseconds. |
| `bucket_mode` | average or extrema; meaningful when bucket_count is positive. |

#### Returns

Channel points and aggregate query statistics.
