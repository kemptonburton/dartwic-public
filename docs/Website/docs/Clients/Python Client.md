---
summary: Connect, query, write, and subscribe; then turn recorded channels into an analysis plot.
updated: 2026-10-27T00:19
created: 2026-08-03T15:41
---

The Python client connects an analysis script or application to a running DARTWIC Engine. You can read current channels, receive live updates, write results, and query recorded samples for plotting.

Calls wait for a response or error. Live updates arrive through callbacks, so your script must stay running while it listens.

# Download and install locally

Download **Python Client** from [Downloads](/areas/dartwic/downloads) and extract it. The client is distributed as a release archive, not through PyPI. Use Python 3.10 or newer and create a virtual environment in your application directory:

```sh
python -m venv .venv
```

Install the extracted directory containing `pyproject.toml`. Replace the example path and version with your downloaded release. On Windows:

```powershell
./.venv/Scripts/python.exe -m pip install ./dartwic-python-client-2.0.0
```

On macOS/Linux:

```sh
./.venv/bin/python -m pip install ./dartwic-python-client-2.0.0
```

The package is installed from that directory, rather than by name from PyPI. Run your scripts with the same virtual environment's Python. The release bundles TEMPEST, and pip installs `pyzmq`. Platforms without a compatible pyzmq wheel need its native build dependencies.

# Connection settings

Start an Engine as described in [First Session](../Getting%20Started/First%20Session.md). The examples use these settings:

| Setting | What to supply |
| --- | --- |
| Host | `127.0.0.1` for an Engine on this computer, or the Engine computer's address. |
| Port | The Engine's base port, shown as `7000`; telemetry uses base port + 1. |
| Password | Your Engine password, read here from `DARTWIC_PASSWORD`. |
| Channels | Replace `tank_pressure` and other example names with your channels. |

# Connect

Set `DARTWIC_PASSWORD` to your engine password. Put the examples below inside this connected scope, replacing the example channel names with yours:

```python
import os
from dartwic_client import DartwicClient

with DartwicClient() as client:
    client.connect("127.0.0.1", 7000, os.environ["DARTWIC_PASSWORD"])
    # Query, write, or subscribe here.
```

`connect` registers the client and checks engine compatibility. The context manager disconnects even if your script raises an exception.

# Client operations

The examples below show common uses. See the [Python API reference](Reference/Python/Overview.md) for the full current API, arguments, and return values. Choose the parts your script needs.

## Query channels

Read one value, a metadata field, or a group of current channel records:

```python
pressure = client.query_channel("tank_pressure")
units = client.query_channel("tank_pressure", field="units")
records = client.get_channels(["tank_pressure", "tank_temperature"])
for name, record in records.items():
    if record["exists"]:
        print(name, record["channel_data"]["value"])
```

A single read raises `KeyError` for a missing channel or field. Batch reads expose `exists`; absence is not zero. This live-read endpoint rounds `value` to three decimals. Recorded queries below retain the recorded samples.

## Search channels

Find channel names before deciding which values to read or display:

```python
matches = client.get_channel_keys(query="tank", limit=25)["channels"]
print(matches)
if matches:
    print(client.get_channels(matches))
```

Search discovers live channel names. Use `list_dataframes()` to discover saved views and query their channels by ID.

## Write channels

Use `upsert_channel` to create or update a channel field. For example, publish an analysis result and its units:

```python
client.upsert_channel("analysis_result", 42.0)
client.upsert_channel("analysis_result", "bar", field="units")
```

For a device adapter that has just read several sensors, send the readings with a simple loop:

```python
readings = {"adapter_pressure": 2.5, "adapter_temperature": 23.5}
for channel, value in readings.items():
    client.upsert_channel(channel, value)
```

Each call is an independent acknowledged write, not an atomic bulk transaction. If a later call fails, earlier writes remain applied. These writes obey [engine authority](../Engine/Channels%20and%20Control.md) and do not take operator manual override. For a remote driver that owns its channels, publishes timestamped batches, and receives commands, use [TEMPEST Peer](../Engine/Networking%20and%20Peers.md).

## Subscribe and receive telemetry

This live monitor receives a snapshot and subsequent updates for ten seconds:

```python
import time

def receive(snapshot):
    if snapshot["exists"]:
        print(snapshot["channel_name"], snapshot["channel_data"]["value"])

stop = client.subscribe_channel("tank_pressure", receive)
try:
    time.sleep(10)
finally:
    stop()
```

The initial callback runs on the subscribing thread; updates arrive on the telemetry thread and may overlap setup. Protect shared application state and keep callbacks short. Multiple listeners share one server reference; the returned stop function is idempotent. Update callback errors are isolated; an initial callback error fails setup.

## Inspect raw telemetry

Use a raw handler when you need the message envelope instead of a managed channel snapshot. Bind it before enabling the channels you need:

```python
def receive(message, suffix):
    print(suffix, message["payload"])

stop_raw = client.subscribe_telemetry("rapid/channels/", receive)
stop_channel = client.subscribe_channel("tank_pressure", lambda snapshot: None)
try:
    time.sleep(10)
finally:
    stop_channel()
    stop_raw()
```

A raw binding alone does not ask the engine to stream a channel.

## Query and plot recorded history

A dataframe is a saved time range over recorded data. Install `matplotlib` in the same environment as the client. Find a saved view by name, page its recorded channel catalog, and query pressure samples within its range:

```python
import matplotlib.pyplot as plt
import time

frame = next((item for item in client.list_dataframes().values()
              if item["name"] == "tank_run"), None)
if frame is None:
    raise RuntimeError("No matching dataframe: tank_run")
response = client.operation("rapid/dataframes/channels", {"id": frame["id"], "query": "pressure", "limit": 100})
response.raise_for_error()
selected = [item["channel"] for item in response.payload["entries"] if item["has_history"]]
if not selected:
    raise RuntimeError("No recorded pressure channels in this range")

history = client.query_channel_range(selected,
    from_timestamp=frame["from_ns"], to_timestamp=frame.get("to_ns") or time.time_ns())
nonempty = [channel for channel in history["channels"].values() if channel["timestamps"]]
if not nonempty:
    raise RuntimeError("No samples in this range")
start = min(channel["timestamps"][0] for channel in nonempty)
for name, channel in history["channels"].items():
    if not channel["timestamps"]:
        continue
    seconds = [(timestamp - start) / 1_000_000_000 for timestamp in channel["timestamps"]]
    plt.plot(seconds, channel["values"], label=name)
plt.xlabel("Seconds since the earliest selected sample")
plt.ylabel("Recorded value")
plt.legend()
plt.show()
```

Channel catalog pages contain at most 200 entries. Query further pages when needed. Raw range queries remain subject to the engine's point limit; set `bucket_count=500` and `bucket_mode="average"` or `"extrema"` for an aggregated preview.

The result is keyed by channel reference under `history["channels"]`, with `points`, `timestamps`, `values`, UTC `datetimes`, and counts. Integer timestamps preserve nanoseconds; Python `datetime` has microsecond resolution. Use integer timestamps for precise joins and exports.

## Call other operations

Use `operation` for Engine or plugin operations without a convenience helper. This one reads the connected Engine's version:

```python
response = client.operation("dartwic/get-runtime-metadata")
response.raise_for_error()
print(response.payload["engineVersion"])
```

Helpers raise on errors themselves. Raw operations return a `TempestResponse`; check it before using its payload.

# Connection lifecycle

The client uses an authenticated heartbeat to detect session loss. A heartbeat shows that the session responds; it does not establish task timing or data freshness.

`is_connected()` reports local state. A registered heartbeat probe detects connection or session loss; detection is not instantaneous. This client does not reconnect automatically. Call `disconnect()`, connect again, then recreate managed channel subscriptions. Serialize lifecycle calls and disconnect outside telemetry callbacks. Parallel operation calls are supported; each uses an independent socket so a late reply cannot satisfy a later request.

A timeout does not cancel work on the engine, and writes are never replayed automatically. Query resulting state before retrying a write.

# Script execution and verification

Save the connection example as `analysis.py`, place the task snippets you need inside its `with` block, and run it with the virtual environment's Python:

```powershell
./.venv/Scripts/python.exe analysis.py
```

On macOS/Linux, use `./.venv/bin/python analysis.py`.

Begin with a read of a known channel, then check that a subscription follows its changes. For the plot, recording must already contain samples in the selected dataframe's range. [Recording and Retention](../Engine/Recording%20and%20Retention.md) explains how those samples are collected. Stop subscriptions before disconnecting.

# Reference

- [Python API reference](Reference/Python/DartwicClient.md) — Connection, channel, subscription, and history methods.
- [Engine operations](../Engine/Reference/TEMPEST/Operations/Overview.md) — Endpoints available through `operation`.
