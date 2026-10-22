---
summary: Connect, query, write, and subscribe; then turn recorded channels into an analysis plot.
updated: 2026-10-22T11:28
created: 2026-08-03T15:41
---

Use the Python client for analysis scripts, live monitors, and applications that write data into an engine. Calls are synchronous; telemetry callbacks run on a receiver thread.

The [public client sources](https://github.com/kemptonburton/dartwic-public/tree/main/clients) can also be downloaded directly. Each client folder includes its transport and install/build metadata; follow its README. Third-party dependencies are still required.

## Download and install locally

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

These commands install a local package; `pip install dartwic-client` is not the installation method. Run your scripts with the same virtual environment's Python. The release bundles TEMPEST, and pip installs `pyzmq`. Platforms without a compatible pyzmq wheel need its native build dependencies.

## Connect

Set `DARTWIC_PASSWORD` to your engine password. Put the examples below inside this connected scope, replacing the example channel names with yours:

```python
import os
from dartwic_client import DartwicClient

with DartwicClient() as client:
    client.connect("127.0.0.1", 7000, os.environ["DARTWIC_PASSWORD"])
    # Query, write, or subscribe here.
```

The base port carries operations; base port + 1 carries telemetry. `connect` registers the client and checks engine compatibility. The context manager disconnects even if your script raises an exception.

By default, liveness uses TEMPEST's dedicated authenticated heartbeat, separate from ordinary operation work. A successful heartbeat establishes protocol/session responsiveness; use operation timing and source timestamps to assess engine work and data freshness.

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

```python
matches = client.get_channel_keys(query="tank", limit=25)["channels"]
print(matches)
if matches:
    print(client.get_channels(matches))
```

Search discovers live channel names. Use `list_dataframes()` to discover saved views and query their channels by ID.

## Upsert channels

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

Each call is an independent acknowledged write, not an atomic bulk transaction. If a later call fails, earlier writes remain applied. These writes obey [engine authority](../Engine/Commanding%20and%20Control.md) and do not take operator manual override. For a remote driver that owns its channels, publishes timestamped batches, and receives commands, use [TEMPEST Peer](../Engine/TEMPEST%20Peers.md).

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

For a raw topic handler, bind before enabling the channels you need:

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

## Example: find recorded channels and plot their history

Install `matplotlib` in the same environment as the client. Find a saved view by name, page its recorded channel catalog, and query pressure samples within its range:

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
start = min(channel["timestamps"][0] for channel in history["channels"].values() if channel["timestamps"])
for name, channel in history["channels"].items():
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

```python
response = client.operation("dartwic/get-runtime-metadata")
response.raise_for_error()
print(response.payload["engineVersion"])
```

Helpers raise on errors themselves. Raw operations return a `TempestResponse`; check it before using its payload.

## Connection loss and analysis details

`is_connected()` reports local state. A registered heartbeat probe detects connection or session loss; detection is not instantaneous. This client does not reconnect automatically. Call `disconnect()`, connect again, then recreate managed channel subscriptions. Serialize lifecycle calls and disconnect outside telemetry callbacks. Parallel operation calls are supported; each uses an independent socket so a late reply cannot satisfy a later request.

A timeout does not cancel work on the engine, and writes are never replayed automatically. Query resulting state before retrying a write.

See the generated [DartwicClient reference](Reference/Python/DartwicClient.md) for all signatures and [Telemetry and History](../Engine/Telemetry%20and%20History.md) for recording behavior.
