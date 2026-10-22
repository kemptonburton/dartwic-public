---
summary: Build a C++ TEMPEST peer that exchanges channels and ARGUS events with an engine.
updated: 2026-10-22T11:28
created: 2026-09-06T14:49
---

Use a TEMPEST peer when your application is a node in the system: it owns measurements, accepts commands, and publishes its own events or logs. For an analysis tool that only calls an engine, use the ordinary [C++ client](C%2B%2B%20Client.md).

The [public client sources](https://github.com/kemptonburton/dartwic-public/tree/main/clients) can also be downloaded directly. Each client folder includes its transport and install/build metadata; follow its README. Third-party dependencies are still required.

The [flight-computer example](https://github.com/kemptonburton/dartwic-example-workspace/tree/main/flight-computer) is a complete C++ application. It simulates flight telemetry and accepts launch, land, and telemetry-rate commands. The same handlers work over native TEMPEST and a plugin-defined custom transport.

## Build the example

Clone the [example workspace repository](https://github.com/kemptonburton/dartwic-example-workspace). Its CMake project uses the public example plugin's bundled messaging, peer, and engine-protocol libraries. A standalone clone fetches a locked plugin revision; no private engine checkout is required.

On Windows, install the toolchain described in its README and set `VCPKG_ROOT`, then run from the repository root:

```powershell
cmake --preset windows-clang-release
cmake --build --preset build-windows-clang-release --target rocket-flight-peer
```

Use the executable under `build/windows-clang-release/Release/`, keeping its runtime DLLs beside it. The downloadable example includes a copy under `flight-computer/bin/`.

## Connect with native TEMPEST

Start the ground workspace first. Stop any custom-mode flight process, then remove its saved connection and start the native peer:

```powershell
$env:DARTWIC_PASSWORD = Read-Host 'Ground engine password' -MaskInput
python tools/peer_mode.py native --port 7400
./flight-computer/bin/rocket-flight-peer.exe --transport native --host 127.0.0.1 --port 7400
```

Use your ground engine's actual base port. The commands above use PowerShell 7. In Network Map, confirm `FLIGHT_COMPUTER` connects, then inspect `FLIGHT_COMPUTER:sample_counter`. It should advance while the flight process runs.

Use the **Rocket Flight** schematic in the [example workspace](../Getting%20Started/Example%20Workspace.md) for launch and land operations. Stop the process with Ctrl+C when finished.

## How the C++ application works

The application has two parts: `TEMPEST::Peer` manages the connection, while `DARTWIC::EngineProtocol` gives it the engine's channel, event, and log messages. Your code supplies the measurements and decides which commands it accepts.

The snippets below are **excerpts from the flight application**, with unrelated code omitted and lines reformatted. They belong together in [flight-computer/main.cpp](https://github.com/kemptonburton/dartwic-example-workspace/blob/main/flight-computer/main.cpp); use that complete file and the repository's CMake project to build and run them.

### Connect a named node

For native TEMPEST, create a ZeroMQ transport using the host, base port, and password read by the application. The flight peer identifies itself as `FLIGHT_COMPUTER` and uses the engine protocol:

```cpp
auto link = TEMPEST::makeZmqTransport({
    .host = host,
    .port = port,
    .password = password
});
TEMPEST::Peer peer({
    .node_name = "FLIGHT_COMPUTER",
    .peer_id = "tempest.engine",
    .protocol_id = "tempest.engine",
    .protocol_version = DARTWIC::EngineContract::version
}, link);
DARTWIC::EngineProtocol protocol(peer);
```

Give each running node a distinct name. Register its handlers before calling `peer.start()`, so it can answer requests as soon as registration completes. The root CMake project links `TEMPEST::Peer` and `DARTWIC::EngineProtocol`. The separate C++ Peer Client download supplies the transport and messaging libraries; this example also uses the engine-protocol library bundled with its locked plugin dependency.

### Describe and publish channels

The flight application keeps its current measurements in atomics because request handlers and the simulation loop access them from different threads. Its `snapshots()` helper turns those values into channel records. This shortened version shows one measurement and one writable setting:

```cpp
const auto snapshots = [&] {
    std::vector<DARTWIC::ChannelSnapshot> result;
    const auto add = [&](std::string key, TEMPEST::Value value,
                         std::string units, bool writable = false) {
        result.push_back({"FLIGHT_COMPUTER", key,
            {{"value", value}, {"units", units},
             {"timestamp", timestamp()},
             {"control_policy", writable ? "free" : "observe_only"},
             {"control_owner", writable ? "" : "peer:flight"},
             {"record_mode", "on_value_change"},
             {"stale_timeout", 2.0}, {"storage", "dynamic"}},
            counter.load(), peer.sessionId()});
    };
    add("sample_counter", counter.load(), "samples");
    add("telemetry_rate_hz", rate.load(), "Hz", true);
    return result;
};
```

`timestamp()` supplies Unix time in nanoseconds. `counter` advances with the simulation, and `rate` starts at 5 Hz. The complete helper also includes altitude, velocity, battery voltage, flight phase, and the received ground state. In the Interface, these become node-qualified channels such as `FLIGHT_COMPUTER:sample_counter`.

The publication loop sends the complete channel set when `peer.ready()` is true and the selected telemetry interval has elapsed:

```cpp
TEMPEST::Value::Object records;
for (const auto& record : snapshots()) {
    records[record.channel] = record.channel_data;
}
peer.publish("tempest-peer/channels/snapshot", {
    {"owner_node", "FLIGHT_COMPUTER"},
    {"channels", std::move(records)},
    {"complete", true}
});
```

A complete snapshot describes the node's current channel set, so include every channel you intend to expose. The example also registers a query handler that returns records from `snapshots()` when requested. Publication sends telemetry; it is not an acknowledgement that another node has processed it.

### Accept a command at the owning node

The ground can command `telemetry_rate_hz`, but the flight application checks the request before changing its setting. This is the actual write handler:

```cpp
channels.upsert = [&](const%20DARTWIC%3A%3AChannelUpsert%26%20request) {
    if (request.owner_node != "FLIGHT_COMPUTER" ||
        request.channel != "telemetry_rate_hz" ||
        request.field != "value") {
        throw TEMPEST::RemoteError(
            "Only telemetry_rate_hz is writable", "permission_denied");
    }
    const auto value = number(request.value);
    if (value < 1 || value > 20) {
        throw TEMPEST::RemoteError(
            "Telemetry rate must be 1 through 20 Hz", "invalid_argument");
    }
    rate = value;
    log("Ground commanded telemetry rate: " +
        std::to_string(value) + " Hz");
};
```

`channels` is a `DARTWIC::ChannelHandlers` object, installed with `protocol.channels().setHandlers(std::move(channels))`. The application's `number()` helper rejects nonnumeric and nonfinite values. Command the rate to 10 from the Interface: the peer accepts the setting, its published channel reads 10, and the **Flight computer** log records the change. A value of 30 is rejected and leaves the previous rate in place.

The same application registers named operations for actions that need more than a channel write. For example, landing changes the simulated flight phase only while the rocket is ascending:

```cpp
peer.registerOperation({
    .name = "flight/land",
    .display_name = "Land mock rocket",
    .description = "Begin the mock rocket landing sequence.",
    .category = "Flight computer"
}, [&](const%20TEMPEST%3A%3AValue%3A%3AObject%26) {
    if (flight_phase.load() != 1) {
        throw TEMPEST::RemoteError(
            "Rocket is not ascending", "failed_precondition");
    }
    flight_phase = 2;
    log("Land command accepted; mock rocket descending");
    return TEMPEST::Value::Object{{"flight_phase", "descent"}};
});
```

The response confirms that descent was requested. Watch `FLIGHT_COMPUTER:altitude_m` and `FLIGHT_COMPUTER:flight_phase` for the result. The launch handler similarly checks the ground quick-disconnect channel before accepting launch. The **Rocket Flight** schematic's `rocket_launch_sequence` and `rocket_land_sequence` call these operations through the saved `launch-rocket` and `land-rocket` actions.

### Follow the connection lifecycle

The complete source starts the peer after registering channel, operation, ARGUS, and log handlers. Its loop checks `peer.ready()` and `peer.remoteSession()`, publishes while connected, and announces the readiness event when a connection or remote session becomes available. On a detected disconnect it clears the cached quick-disconnect permission. Ctrl+C exits the loop and calls `peer.stop()`.

Try stopping and restarting the flight process. After the ground detects the disconnect, its last channel values remain visible but commands to that owner are rejected. On reconnect, confirm that `sample_counter` advances before relying on the readings. If an action request times out, inspect the resulting state before retrying it.

## Use a custom link

The [example workspace](../Getting%20Started/Example%20Workspace.md#optional-flight-node) uses the same application with the example plugin's transport. The transport carries framed messages through bounded queues; the peer handles registration, heartbeat, and request correlation. In this example, a reported custom-link failure ends the flight process. Restore the link and restart the process to reconnect.

Do not run native and custom instances with the same node name together. [TEMPEST Peers](../Engine/TEMPEST%20Peers.md) explains engine-side connection settings, channel filtering, and cleanup.
