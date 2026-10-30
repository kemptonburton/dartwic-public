---
summary: Use the C++ peer API for channels, events, logs, and custom operations.
updated: 2026-10-28T20:05
created: 2026-09-06T14:49
---

Connect your C++ application as a named node to publish measurements, handle commands, and exchange events and logs. Your application owns its data; the client handles communication.

Use the ordinary [C++ client](C%2B%2B%20Client.md) if your program only accesses Engine data and does not expose its own channels or handlers.

`DARTWIC::EngineProtocolPeer` assembles the protocol, peer, and default ZeroMQ transport. The Engine uses this exact `DARTWIC::EngineProtocolPeer` class too:

```text
Application data and handlers ↔ EngineProtocol ↔ TEMPEST::Peer
                                                    ↕
                                            Default/custom transport
                                                    ↕
                                            Communication link
                                                    ↕
                                            Engine-side transport
                                                    ↕
                             RAPID / ARGUS ↔ EngineProtocol ↔ TEMPEST::Peer
```

The default transport needs only connection settings. A custom link needs matching framing at both ends, with the Engine end registered by a plugin. [Transport Setup](#transport-setup) covers that workflow and protocol bridges such as F Prime CCSDS.

# Project Setup

The **C++ Peer Client** package includes the DARTWIC protocol and default ZeroMQ transport. Extract it into your project's `vendor/dartwic-peer/` directory and link one target:

```cmake
cmake_minimum_required(VERSION 3.20)
project(peer_demo LANGUAGES CXX)

add_subdirectory(vendor/dartwic-peer)
add_executable(peer_demo main.cpp)
target_link_libraries(peer_demo PRIVATE DARTWIC::EngineProtocolPeer)
```

Use a C++20 compiler and provide ZeroMQ dependencies through your CMake toolchain. Use package version 3.0.0 with Engine 2.1.0 or newer.

Choose **Engine Protocol Peer — TEMPEST TCP** in Network Map. This is TEMPEST over ZeroMQ/TCP with the Engine protocol for channels, events, and logs, plus custom operations and telemetry. If you only need your own operations and telemetry, use [C++ TEMPEST Protocol Peer](C%2B%2B%20TEMPEST%20Protocol%20Peer.md).

Installed consumers use `find_package(DARTWICPeerClient CONFIG REQUIRED)` and link `DARTWIC::EngineProtocolPeer`. The package name stays the same. Existing `<dartwic/PeerClient.h>`, `DARTWIC::PeerClient`, `PeerClientConfig`, and the old CMake target remain compatibility aliases.

## Engine Socket Reuse

The Engine attaches `EngineProtocolPeer` to its existing server-owned `TEMPEST::Peer`. This constructor retains that peer and adds the Engine protocol without opening another transport. The ZeroMQ hub continues to reuse the Engine's bound ROUTER/PUB sockets and shared subscription socket; each peer keeps its own outbound DEALER connection.

The standalone application constructor creates its own transport and stops its peer on destruction. The adopted-peer constructor leaves start/stop ownership with the server. In either case, stop and join the peer before destroying state captured by handlers. The Engine and application share the same implementation; their data handlers and socket ownership differ.

# Peer Setup

Construct the client with your node name and Engine connection settings. Register handlers before `start()`, then wait for registration before making requests.

The following `main.cpp` is a small publisher. It takes a simulated temperature reading every 200 ms and sends its complete shared channel selection for ten seconds:

```cpp
#include <dartwic/EngineProtocolPeer.h>
#include <chrono>
#include <cstdlib>
#include <iostream>
#include <thread>

// Timestamp measurements using Unix-epoch nanoseconds.
uint64_t nowNs() {
    return std::chrono::duration_cast<std::chrono::nanoseconds>(
        std::chrono::system_clock::now().time_since_epoch()).count();
}

int main() {
    try {
        // Read credentials before constructing the connection.
        const char* password = std::getenv("DARTWIC_PASSWORD");
        if (!password) {
            std::cerr << "Set DARTWIC_PASSWORD before starting.\n";
            return 1;
        }

        // Give the application a node name and the Engine endpoint.
        DARTWIC::EngineProtocolPeer peer({
            .node_name = "LAB_APP",
            .host = "127.0.0.1",
            .port = 7400,
            .password = password
        });

        // Register any incoming handlers here, before start().
        peer.start();
        peer.waitUntilReady();

        // Publish successive measurements from the application.
        for (int sample = 0; sample < 50; ++sample) {
            const double temperature = 24.0 + sample * 0.1;
            const auto measuredAt = nowNs();

            // Send a complete shared-channel snapshot only while ready.
            if (peer.ready()) {
                peer.channels().publishSnapshotTelemetry({
                    .channels = {{
                        .channel = "temperature",
                        .fields = {
                            .value = temperature,
                            .timestamp = measuredAt,
                            .units = "degC"
                        }
                    }}
                });
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }

        // Stop I/O before application state is destroyed.
        peer.stop();
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
```

In Network Map, look for `LAB_APP`. Its measurement appears as `LAB_APP:temperature`. After the program stops, a retained value is an earlier observation, not a fresh measurement.

## Connecting Across Machines

The short constructor uses loopback endpoints for the application's receiving sockets. When the Engine is on another machine, supply the same built-in transport with an address that the Engine can reach:

```cpp
auto transport = TEMPEST::makeZmqTransport({
    .host = "192.168.1.10", .port = 7200, .password = password,
    .bind_host = "0.0.0.0", .advertised_host = "192.168.1.20"
});
DARTWIC::EngineProtocolPeer peer({.node_name = "LAB_APP"}, transport);
```

Here `.10` is the Engine and `.20` is this application. The supplied transport owns endpoint settings; the wrapper supplies the Engine protocol identity. Set `operations_port` and `telemetry_port` in `ZmqPeerConfig` when you need fixed application ports for firewall rules; zero chooses available ports. This uses the standard TEMPEST transport and needs no transport implementation or Engine plugin.

## Connection Lifecycle

1. Create application objects before the peer so they outlive its callbacks.
2. Register handlers, then call `start()` and `waitUntilReady()`.
3. Publish or call the remote node while ready. After reconnecting, send a fresh complete snapshot.
4. Call `stop()` before destroying handler state. Destruction also stops the client; create a new client to start again after an explicit stop.

Each `setHandlers` call replaces that group's callbacks: combine the ones you need into one registration. Missing command handlers return an unsupported error. Commands run on the request worker; telemetry callbacks run on a separate callback worker. Synchronize shared application data accordingly.

Commands wait for results or rejection. A timeout after submission leaves the outcome unknown; inspect authoritative state before retrying. Telemetry is best effort. Snapshots repair the current shared view, not every lost sample. Registration alone does not establish fresh observations.

Later blocks are optional excerpts. `controller`, `eventManager`, `logger`, and `display` are application code, not SDK-provided stores.

# Channels

## Sending Commands and Queries

Commands address the connected node. Upsert changes only supplied fields; the owner decides whether a change or creation is allowed:

```cpp
// Request changes on the channel owner.
peer.channels().upsert("target_temperature", {.value = 30.0, .units = "degC"});
peer.channels().upsert(writes);  // Batch of channel changes.
peer.channels().remove("temporary_channel");

// Query selected channels or the complete shared set.
auto selected = peer.channels().query({"temperature", "target_temperature"});
auto all = peer.channels().query();
```

| Argument or result | Contents |
| --- | --- |
| Upsert change | `channel` name and `fields` containing only requested changes. `request.changes` holds one or more changes. |
| Writable fields | Numeric `value`, optional Unix-nanosecond `timestamp`, `units`, `stale_timeout` in seconds, `record_mode`, `calculation_scripts`, `value_options`, and `startup_value`. Structured settings follow RAPID's field definitions. Identity and authority are not writable fields. |
| Recording mode | `"on_value_change"`, `"every_value"`, or `"never"` for write-triggered recording. |
| `ChannelQuery` | `channels` and optional `fields` selections; empty selections mean all available channels/fields. |
| `ChannelQueryResult` | `channels`: matching current records, with channel name, owner, fields, and source lineage. |

A timestamp accompanies a value, not an independent measurement-time change. A batch does not imply an atomic transaction. Current-state queries do not retrieve historical samples; Interface graph history keeps using the connected Engine's recorded database.

## Receiving Commands

`ChannelHandlers` holds the callbacks. The upsert and removal callbacks complete normally on success or throw `TEMPEST::RemoteError(message, code)` on rejection; queries return records:

```cpp
// Route incoming channel commands to the local controller.
DARTWIC::ChannelHandlers handlers;

handlers.upsertCommand = [&](const DARTWIC::ChannelUpsertRequest& request) {
    controller.applyChannelChanges(request);
};

handlers.queryCommand = [&](const DARTWIC::ChannelQuery& query)
    -> DARTWIC::ChannelQueryResult {
    return controller.queryChannels(query);
};

handlers.removeCommand = [&](const DARTWIC::ChannelRemoveRequest& request) {
    controller.removeChannel(request.channel);
};

// Add any telemetry callbacks below to this same object.
peer.channels().setHandlers(std::move(handlers));
```

Validate names, fields, ranges, and authority. For example, reject invalid targets with `RemoteError("Target must be 0 through 100", "invalid_argument")`. Success confirms handling, not physical feedback.

## Sending Channel Telemetry

Report a measurement with its source timestamp, or pass a `ChannelUpdates` batch to the same method:

```cpp
peer.channels().publishChannelTelemetry({
    .channel = "temperature",
    .fields = {.value = 24.5, .timestamp = measuredAt, .units = "degC"}
});
peer.channels().publishChannelTelemetry(updates);
```

`measuredAt` is the reading's Unix-nanosecond timestamp. A batch can contain multiple timestamped samples from one channel. The client supplies local source identity and protocol lineage. Publishing neither stores the reading nor changes unmentioned channels.

## Sending Channel Snapshots

A `ChannelSnapshot` contains the complete current shared selection in `channels`, as shown in the initial publisher. An application adapter can return it directly:

```cpp
peer.channels().publishSnapshotTelemetry(controller.sharedChannels());
```

Include unchanged channels with their original measurement timestamps. Missing channels leave the receiver's mirrored selection; an empty complete snapshot clears it. Never send a partial collection as complete. The Engine publishes snapshots at 5 Hz; an external application schedules its own loop.

## Receiving Channel Telemetry

Add these callbacks to the channel handler object before registering it:

```cpp
// Apply incremental updates to the display.
handlers.channelTelemetry = [&](const DARTWIC::ChannelUpdates& updates) {
    display.applyChannelUpdates(updates);
};

// Reconcile the complete shared-channel set from a snapshot.
handlers.snapshotTelemetry = [&](const DARTWIC::ChannelSnapshot& snapshot) {
    display.replaceSharedChannels(snapshot);
};
```

`updates` carries selected channel fields/samples with owner and source information. `snapshot.channels` contains the sender's complete current selection. Updates leave other records alone; snapshots reconcile membership. Both describe the sender's data, not commands to locally owned channels.

# Events

## Sending Events

`ArgusEvent` is the event record. Publish every event type through one method:

```cpp
auto eventId = peer.argus().publishEventTelemetry({
    .type = DARTWIC::EventType::Warning,
    .title = "High temperature",
    .description = "Temperature exceeded the configured limit.",
    .firing_timeout_seconds = 2.0
});
```

| Field | Contents |
| --- | --- |
| `type` | Proposed `EventType::Message`, `Warning`, `Error`, `Abort`, `Hold`, or `Prompt`. |
| `event_id`, `owner_node` | Event identity and owner. The client supplies local identity when omitted; reuse the event ID for updates. |
| `title`, `description` | Human-readable condition and explanation. |
| `status` | A string such as `"new"` or `"acknowledged"`; see the status table below. |
| `timestamp`, `channels`, `details` | Unix-nanosecond event time, related channel references, and extra key/value data. |
| `firing_timeout_seconds` | Required finite, nonnegative firing separation: positive groups nearby reports; zero needs an explicit owner-side stop. |

Your application owns event lifecycle. Publishing neither stores events nor executes timers, aborts, or holds. The returned ID is not delivery confirmation.

## Event Actions

Commands operate on an event owned by the connected node and return an `ArgusActionResult`:

```cpp
// Acknowledge the event, then answer an operator prompt.
auto result = peer.argus().updateStatus(eventId, "acknowledged");

peer.argus().respondToPrompt(promptId, {
    {"prompt_type", "string"}, {"prompt_response", "continue"}
});

// Release a hold or remove an event through its owner.
peer.argus().releaseHold(holdId);  // Optional response object defaults to {}.
peer.argus().remove(eventId);
```

`updateStatus` receives an event ID and a **status string**, not a status object. Ordinary workflow values are:

| Status string | Requested meaning |
| --- | --- |
| `"new"` | Mark unacknowledged, where the owner permits that transition. |
| `"acknowledged"` | Mark seen; also used by the Interface to undo silence or resolution. Does not clear an active condition. |
| `"silenced"` | Silence the event while preserving its firing condition. |
| `"resolved"` | Resolve the event. The Engine rejects resolution while it is still firing. |

These describe the existing Engine workflow, not an exhaustive SDK string whitelist; the owner validates supported transitions. Received records may also contain `"responded"`, `"released"`, `"deleted"`, or `"stale"`. Use `respondToPrompt`, `releaseHold`, and `remove` for those actions: assigning a status string does not deliver a prompt answer or release an actual hold. `updateStatus` does not edit titles, descriptions, or related channels.

A prompt response is a `DARTWIC::Value::Object` (a string-keyed map of values). The example uses the Engine's existing fields: `prompt_type` selects `"string"`, `"int"`, `"double"`/`"input-numerical"`, or `"yes-no"`; `prompt_response` supplies the answer as text. An application-owned prompt can define other documented payload fields. Hold-release payloads are also objects and may be empty.

## Receiving Event Actions

The status callback makes the input and output concrete. In this excerpt, your `eventManager.updateStatus` applies and validates a transition and returns a Boolean:

```cpp
// Let the local event manager validate incoming status changes.
DARTWIC::ArgusHandlers handlers;

handlers.updateStatusCommand = [&](const std::string& id, const std::string& status)
    -> DARTWIC::ArgusActionResult {
    if (!eventManager.updateStatus(id, status)) {
        throw TEMPEST::RemoteError("Status change rejected", "invalid_transition");
    }
    return {id, {{"updated", true}, {"status", status}}};
};

// Add other actions and telemetry callbacks, then register once.
peer.argus().setHandlers(std::move(handlers));
```

`ArgusActionResult` holds `event_id` and a `result` object, here `{"updated": true, "status": "acknowledged"}`. Publish the changed event separately.

| Other handler | Receives | Returns |
| --- | --- | --- |
| `queryCommand` | `const ArgusQuery&` | `ArgusQueryResult`: `events`, returned `count`, and matching `total_count`. |
| `respondToPromptCommand` | Event ID string and `const Value::Object& response` | `ArgusActionResult` describing whether the response was handled; reject unsupported answers. |
| `releaseHoldCommand` | Event ID string and `const Value::Object& response` | `ArgusActionResult` after validating and releasing the hold. |
| `removeCommand` | Event ID string | `ArgusActionResult`, for example `{id, {{"deleted", true}}}` after removal. |

Reject actions with `RemoteError`. Prompt answers use `respondToPromptCommand`. Successful removal lets the caller remove its mirror; other nodes reconcile on the next snapshot. Mirrored removal does not erase history.

## Querying Events

`ArgusQuery` can select `event_id`, `owner_node`, `type`, `status`, time bounds `since`/`until`, and `limit`, plus supported extra `filters`. Time bounds use Unix nanoseconds; unsupported filters should be rejected by the owner. Query `type` retains the existing lowercase string representation:

```cpp
auto result = peer.argus().query({.status = "new", .type = "warning", .limit = 50});
for (const auto& event : result.events) {
    std::cout << event.event_id << ": " << event.status << '\n';
}
```

## Event Snapshots and Reception

Send the complete current board from your application; `currentBoard()` returns an `ArgusBoardSnapshot` containing an `events` collection:

```cpp
peer.argus().publishSnapshotTelemetry(eventManager.currentBoard());
```

Add receive callbacks to the ARGUS handler object before registering:

```cpp
// Update one event when an individual observation arrives.
handlers.eventTelemetry = [&](const DARTWIC::ArgusEvent& event) {
    display.updateEvent(event);
};

// Reconcile the complete board, including removed events.
handlers.snapshotTelemetry = [&](const DARTWIC::ArgusBoardSnapshot& snapshot) {
    display.replaceEventBoard(snapshot);
};
```

Individual events update one record; snapshots reconcile the complete board, including removals. Neither is a local detection. Engine snapshots run at 5 Hz; applications schedule their own.

# Logs

Logs are chronological text entries grouped by source stream and process session. They have no acknowledgement workflow or complete-snapshot message.

## Sending and Receiving Logs

`publishLogTelemetry` accepts one `LogEntry` or a batch; the receive callback always gets a batch:

```cpp
// Publish a local log entry or an existing batch.
peer.logs().publishLogTelemetry({
    .stream = "Device", .level = "info",
    .text = "Device connected.", .timestamp_ns = nowNs()
});
peer.logs().publishLogTelemetry(entries);

// Receive remote log batches for the application display.
peer.logs().setHandlers({
    .logTelemetry = [](const std::vector<DARTWIC::LogEntry>& entries) {
        for (const auto& entry : entries) std::cout << entry.text << '\n';
    }
});
```

| `LogEntry` field | Contents |
| --- | --- |
| `stream`, `text` | Source name, such as `"Device"`, and message text. |
| `level`, `channel` | Severity label, commonly `"info"`, `"warning"`, or `"error"`; output channel, normally `"stdout"` or `"stderr"`. Both are strings. |
| `timestamp_ns` | Original entry time in Unix nanoseconds. |
| `owner_node`, `session`, `sequence` | Source node, process session, and increasing sequence within that stream/session. |

For new local entries, the client supplies source/sequence bookkeeping. If your logger retains entries for queries, it must share those identifiers rather than generate a second sequence. Publishing does not retain history or confirm remote persistence.

## Log History

Add history handlers only if your application retains logs. `listCommand` takes no arguments and returns `std::vector<LogStream>`; `queryCommand` receives a `LogQuery` and returns `std::vector<LogEntry>`:

```cpp
// Expose the application's retained log streams and entries.
DARTWIC::LogHandlers handlers;

handlers.listCommand = [&]() -> std::vector<DARTWIC::LogStream> {
    return logger.listStreams();
};

handlers.queryCommand = [&](const DARTWIC::LogQuery& query)
    -> std::vector<DARTWIC::LogEntry> {
    return logger.query(query);
};

// Include logTelemetry here as well if needed.
peer.logs().setHandlers(std::move(handlers));
```

A `LogStream` contains `owner_node`, `session`, and `stream`. Use those fields to query a remote source:

```cpp
// Discover a retained source stream.
auto streams = peer.logs().list();
if (!streams.empty()) {
    const auto& source = streams.front();

    // Query recent entries using that source's identifiers.
    auto entries = peer.logs().query({
        .owner_node = source.owner_node, .session = source.session,
        .stream = source.stream, .limit = 50
    });
}
```

`LogQuery` also accepts `text`, `level`, `channel`, sequence bounds `before`/`after`, and Unix-nanosecond bounds `from_ns`/`to_ns`. Apply requested filters and limit, or reject unsupported filters. The Engine uses these queries for catch-up; a program without retained logs cannot recover entries lost before reaching the Engine.

# Operations

Use a custom operation when a request does not fit channel, event, or log behavior. Register it before starting the peer:

```cpp
peer.registerOperation("lab/echo", [](const TEMPEST::Value::Object& arguments) {
    return arguments;
});
```

Arguments and replies are `TEMPEST::Value::Object`: string-keyed maps whose values can be numbers, strings, Booleans, arrays, or objects. Throw `RemoteError` to reject a request; the descriptor overload supplies argument metadata and roles.

Call an operation implemented by the connected node with:

```cpp
auto reply = peer.call("lab/echo", {{"message", "hello"}});
```

That node must register `lab/echo`; registering it locally only lets the other node call your implementation. A response confirms the remote handler's result, not an arbitrary physical outcome.

## Sending and Receiving Custom Telemetry

Custom topics use the same low-level messaging methods as the TEMPEST-only peer:

```cpp
peer.onTelemetry("peer_demo.status", [](const TEMPEST::Value::Object& payload) {
    // Consume the connected application's observation.
});
peer.publish("lab/reading", {{"temperature", 24.5}});
```

Register the receive handler before starting. Publish after readiness; telemetry is best effort and has no command acknowledgement. For a runnable exchange covering commands and telemetry in both directions, including the Engine plugin handlers, see [C++ TEMPEST Protocol Peer](C%2B%2B%20TEMPEST%20Protocol%20Peer.md#engine-handlers).

# Transport Setup

The default link needs no custom plugin. A custom link needs both an application transport and an Engine plugin registering the matching transport.

## Application Transport

Implement `TEMPEST::Transport` in your application. These declarations show the boundary; they are not a functioning network implementation:

```cpp
#include <tempest/Transport.h>

class MyTransport : public TEMPEST::Transport {
public:
    // Open the link and report its physical availability.
    void start() override;

    // Queue messages for the link's I/O worker.
    void send(TEMPEST::Message message) override;

    // Finish I/O and release callbacks before returning.
    void stop() override;
};
```

| Method | Your implementation supplies |
| --- | --- |
| `start` | Open the configured link and start I/O. Report physical availability through `setConnected(...)`; deliver decoded DARTWIC messages through `receive(message)`. Registration still determines peer readiness. |
| `send` | Queue a message promptly in a bounded queue; encode and transmit on your I/O worker. Preserve message kind, request ID, name, payload, and errors. Honor local deadlines without transmitting monotonic-clock values or replaying accepted commands. |
| `stop` | Stop delivery, join I/O, and release callbacks before returning. The transport destructor should stop it too. |

Then supply an instance to the client, using the standard DARTWIC peer identity:

```cpp
#include <dartwic/EngineProtocolPeer.h>
#include <memory>

// Supply the application's physical link.
auto transport = std::make_shared<MyTransport>();

// Attach the shared Engine protocol to that transport.
DARTWIC::EngineProtocolPeer peer({
    .node_name = "LAB_APP"
}, transport);

// Register the channel/event/log handlers shown earlier before starting.
peer.start();
peer.waitUntilReady();
```

Your class owns endpoint settings and framing. `EngineProtocolPeer` supplies the DARTWIC protocol/version. The Engine selects the registered `transport_id`; the application keeps the standard DARTWIC peer identity. Domain APIs stay unchanged. Follow the [transport implementation workflow](../Plugins/Building%20a%20Custom%20Peer.md#transport-interface) for queue, encoder, and decoder details.

## Engine Transport or Protocol Bridge

On the Engine side, follow [Building a Custom Peer — Custom Transport](../Plugins/Building%20a%20Custom%20Peer.md#custom-transport). Register the link with `registerPeerTransport` and provide its transport factory. The Engine uses the standard DARTWIC peer and protocol automatically. Install the plugin and select its connection type in Network Map with the matching node and endpoints. The Engine constructs its peer and binds RAPID/ARGUS handlers; the plugin supplies the link.

If the external device speaks its own protocol, follow [Protocol Bridge](../Plugins/Building%20a%20Custom%20Peer.md#protocol-bridge) instead. Register that device with `registerPeer`. The Engine supplies Peer and EngineProtocol to its transport factory, which translates external packets, commands, and supported queries. The device does not need this C++ client. F Prime CCSDS is the example. The linked guide uses the same channel, event, and log APIs.

# Building and Running

Build the publisher with your dependency toolchain:

```sh
cmake -S . -B build
cmake --build build --config Release
```

Start the Engine, set `DARTWIC_PASSWORD`, and run `peer_demo`. Check `LAB_APP:temperature` in Channels. Keep runtime libraries beside the executable or on the library search path.

The [flight-computer example](https://github.com/kemptonburton/dartwic-example-workspace/tree/main/flight-computer) also demonstrates channel handlers and telemetry using the compatible `PeerClient` name.

# Reference

API declarations and record types:

- [TEMPEST peer reference](Reference/TEMPEST/Overview.md) — Peer lifecycle, operations, telemetry, and transport.
- [Engine Protocol reference](../Plugins/Reference/TEMPEST/Engine%20Protocol/Overview.md) — Current channel, event, and log types.
- [Building a Custom Peer](../Plugins/Building%20a%20Custom%20Peer.md) — Plugin-defined transports and protocol bridges.
