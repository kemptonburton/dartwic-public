---
summary: Build custom transports and bridges with the shared DARTWIC protocol API.
created: 2026-10-27
updated: 2026-10-28T20:05
---

A custom peer plugin adds a connection type to Network Map. It implements the link to your application or device and uses the shared DARTWIC protocol for channels, events, logs, and commands.

| Approach         | What your transport does                                                                   | Example                                   |
| ---------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| Custom transport | Carries DARTWIC messages between TEMPEST peers using your framing and link.                | Two DARTWIC Engines, or an Engine and a C++ program, over a radio link.     |
| Protocol bridge  | Translates device packets into DARTWIC telemetry and DARTWIC commands into device packets. | F Prime CCSDS telemetry and telecommands. |

Both use `TEMPEST::Transport`, `TEMPEST::Peer`, and `DARTWIC::EngineProtocol`. Register a device integration with `registerPeer`; register a DARTWIC link with `registerPeerTransport`. The Engine constructs and connects Peer and EngineProtocol in both cases.

# Transport, Peer, and Engine Protocol

## Overview

The three objects separate application data, communication, and physical I/O. From closest to Engine data to closest to the hardware:

```text
Engine data ↔ EngineProtocol ↔ Peer ↔ Transport ↔ physical link
```

**`DARTWIC::EngineProtocol` connects your data to the peer.** Construct it with `EngineProtocol(peer)`. You use its APIs and supply handlers; you do not implement this class or give it a database.

| Important API | What you use it for |
| --- | --- |
| `EngineProtocol(peer)` | Attach the domain message routes to that Peer, so it can dispatch channel/event/log traffic through this protocol. |
| `channels()`, `argus()`, `logs()` | Access the channel, event, and log APIs. |
| `channels().upsert(...)`, `query(...)`, `remove(...)` | Send a command/query to the connected node and wait for its result. |
| `channels().setHandlers(handlers)` | Supply functions for incoming channel messages, such as `upsertCommand` and `channelTelemetry`. ARGUS and logs have their own handler groups. |
| `channels().publishChannelTelemetry(update)` | Report your own channel data without waiting for a reply. Events use `argus().publishEventTelemetry(...)`; logs use `logs().publishLogTelemetry(...)`. |
| `channels().publishSnapshotTelemetry(snapshot)` | Report the complete shared channel selection. ARGUS has the equivalent for the event board. |

**`TEMPEST::Peer` manages the conversation.** It handles registration, heartbeats, dispatch, and matching replies to requests. Every Peer uses the same `Peer(config, transport)` constructor and `start()`; the transport determines where messages go.

| Peer API | What it does | When used |
| --- | --- | --- |
| `Peer(config, transport)` | Construct a peer with its node/protocol identity and communication path. | The Engine and C++ client use a network transport; the Engine connects the bridge representative locally. |
| `start()` | Start the supplied transport and peer registration. | After constructing the peer and registering handlers, in all setups. |
| `waitUntilReady()` / `ready()` | Wait for registration, or check readiness without waiting. The wait can fail or time out. | Before application requests/publications; readiness does not establish fresh device data. |
| `stop()` | Stop communication and join workers. | Before destroying handler state. |
| `registerOperation(name, handler)` | Expose a custom operation, optionally with argument metadata. | Vehicle dictionary commands or other operations outside channel/event/log APIs. |
| `call(name, arguments)` | Send a custom request and wait for its reply. | When invoking an operation on the connected node. |
| `onTelemetry(topic, handler)` | Receive a custom telemetry topic. | Application-specific topics; EngineProtocol registers its own domain routes. |
| `publish(topic, payload)` | Send custom telemetry without waiting for a reply. | Application-specific topics; use EngineProtocol for channels, events, and logs. |

**`TEMPEST::Transport` is the part you implement for a new link.** It moves `Message` envelopes—request, response, or telemetry—between Peer and radio bytes. Peer calls these methods on your class:

| Required method | Your implementation |
| --- | --- |
| `start()` | Open the link and begin receiving. |
| `send(message)` | For a DARTWIC link, encode and queue an outgoing message. A device bridge sends through protocol handlers and does not override this method. |
| `stop()` | Stop I/O and callbacks, join workers, and release the link. |

Peer connects your transport internally. Use `receive(message)` for decoded DARTWIC messages and `setConnected(connected, reason)` for physical link availability. Peer handles registration and dispatch; EngineProtocol handles application data.

## Custom Transport Objects

**Implement `Transport` and register its factory with `registerPeerTransport`. The Engine creates `Peer` and `EngineProtocol`.**

Register the factory with `dartwic->registerPeerTransport(...)` in the plugin's `onPluginLoaded()`. When an operator connects through Network Map, the Engine calls that factory, attaches a Peer to the returned transport, and attaches EngineProtocol with its RAPID/ARGUS handlers.

Your transport only moves DARTWIC messages. The remote Engine has the same three objects. For a remote C++ program, `EngineProtocolPeer` creates Peer and EngineProtocol around your supplied transport, with your application handlers instead of RAPID/ARGUS. You do not create another Peer inside the transport class.

## Protocol Bridge Objects

**Register the device with `registerPeer`. The Engine supplies its representative `Peer` and `EngineProtocol` to your transport factory.**

Your transport owns device I/O and translation. Its decoder publishes measurements through the supplied protocol; protocol handlers encode commands for the device. Use the supplied Peer for custom operations. The Engine manages registration, heartbeats, message routing, and shutdown. The device needs no DARTWIC library.

# Project Setup

Start with the [example plugin](Overview.md#example-plugin) for a custom transport, or the [F Prime bridge](https://github.com/kemptonburton/fprime-dartwic-plugin) for device translation. Keep its plugin exports, SDKs, and build setup; [Engine Plugin](Engine%20Plugin.md#plugin-lifecycle) explains the entry point.

Each example starts with the plugin entry-point file and its registration, then implements the class that registration creates. The two `onPluginLoaded()` bodies are alternatives; to offer both connection types from one plugin, combine their registrations in one method.

Both examples assume your `plugin.json` sets the plugin ID to `my_plugin`.

# Custom Transport

This example adds a **Radio Link** connection type so two Engines can exchange DARTWIC messages over paired radios. We will implement `RadioTransport`, register it as `my_plugin.radio_link`, and configure both Engines in Network Map. The final example reuses the transport in a C++ program.

## Transport Registration

Start in your plugin's entry-point source, `engine/src/my_plugin.cpp`. `MyPlugin` is your starter's `BasePlugin` subclass; keep its header, constructor, and library exports as described in [Engine Plugin](Engine%20Plugin.md#plugin-lifecycle). This is its registration method:

```cpp
#include "my_plugin.h"
#include "RadioTransport.h"
#include <dartwic/EngineProtocol.h>
#include <memory>

void MyPlugin::onPluginLoaded() {
    // Register a connection TYPE. No radio is opened at plugin load time.
    dartwic->registerPeerTransport({
        .id = "radio_link",
        .name = "Radio Link",
        // Defaults shown when the operator configures this connection.
        .default_config = {
            {"node_name", "REMOTE_ENGINE"},
            {"port", "COM7"},
            {"baud_rate", 115200}
        },
        .protocol_id = "tempest.engine",
        .protocol_version = DARTWIC::EngineContract::version,
        .engine_protocol = true,
        // Construct the link when a connection is opened.
        .create = [](const nlohmann::json& config) {
            return std::make_shared<RadioTransport>(config);
        }
    });
}
```

With plugin ID `my_plugin`, this creates the **Radio Link** type `my_plugin.radio_link` in Network Map. The Engine calls `create(config)` later for each configured connection, then constructs Peer and EngineProtocol internally and starts your transport.

| File you build | Purpose |
| --- | --- |
| `engine/src/my_plugin.cpp` | Register the type and its transport factory, as above. |
| `engine/include/RadioTransport.h` | Implement the transport's `start`, `send`, and `stop`. |
| Your `RadioLink` and `RadioCodec` files | Implement radio I/O, framing, and message encoding. |

## Transport Interface

First, implement the transport in `RadioTransport.h`. `RadioLink` and `RadioCodec` are your radio-specific I/O and encoding helpers; their required behavior is listed after the code.

**Both ends of this radio link speak DARTWIC:** the other end is an Engine or a program using `EngineProtocol`, with matching radio framing and message encoding. The codec only converts `TEMPEST::Message` envelopes to/from bytes; it does not know about the Engine, channels, or device behavior.

```cpp
#include "RadioLink.h"    // Your radio I/O worker and bounded transmit queue.
#include "RadioCodec.h"   // Your encodeMessage / decodeMessage functions.
#include <tempest/Transport.h>
#include <nlohmann/json.hpp>
#include <chrono>
#include <stdexcept>
#include <string>
#include <utility>

class RadioTransport : public TEMPEST::Transport {
public:
    explicit RadioTransport(const nlohmann::json& config) : radio_(config) {}

    // Called by our local Peer when it starts the connection.
    void start() override {
        try {
            radio_.start(
                [this](const std::string& payload) {
                    // RECEIVE: the radio worker has assembled and checked a frame.
                    // Decode its bytes into a Message, without interpreting its meaning.
                    auto message = decodeMessage(payload);
                    if (message) {
                        // Deliver to our local Peer. It handles control/replies or
                        // dispatches application messages through EngineProtocol.
                        receive(std::move(*message));
                    }
                },
                [this](TEMPEST::ConnectionState state, const std::string& detail) {
                    // Report physical link changes; Peer determines protocol readiness.
                    setConnected(state == TEMPEST::ConnectionState::Connected, detail);
                });
        } catch (...) {
            stop();
            throw;
        }
    }

    // SEND: our local Peer calls this with a message for the other end.
    void send(TEMPEST::Message message) override {
        if (message.deadline <= std::chrono::steady_clock::now()) {
            throw std::runtime_error("Radio message deadline expired");
        }

        auto encoded = encodeMessage(message); // Message envelope -> wire bytes.

        // Queue promptly. The radio worker frames/writes the bytes; the remote
        // transport decodes them and delivers the Message to its own Peer.
        if (!radio_.tryQueue(std::move(encoded), message.deadline)) {
            if (message.kind == TEMPEST::Message::Kind::Telemetry) return;
            throw std::runtime_error("Radio unavailable or transmit queue full");
        }
    }

    // Join I/O before transport callbacks can be destroyed.
    void stop() override {
        radio_.stop();       // Cancel I/O, join worker, discard queued frames.
    }

    ~RadioTransport() override { stop(); }

private:
    RadioLink radio_;
};
```

`RadioLink.h` and `RadioCodec.h` are illustrative files you implement using your radio/serial library, not supplied SDK headers. The transport bodies are concrete; hardware I/O and framing remain specific to your radio:

| Helper | Implementation needed |
| --- | --- |
| `RadioLink(config)` | Read the local serial `port` and `baud_rate`; do not open hardware until `start`. |
| `start(onPayload, onState)` | Open the port and start one I/O worker. Assemble fragments into complete frames, validate length/checksum, then call `onPayload`. Report link state independently of TEMPEST registration. Throw on startup failure. |
| `tryQueue(payload, deadline)` | Thread-safe, bounded enqueue. Return false when unavailable/full. On the worker, frame and write the bytes before their original deadline; do not block response/receive processing. |
| `stop()` | Cancel reads/writes, join the worker, clear queues and callbacks, and close the port. It must not throw and must tolerate partial startup and repeated calls. |
| `encodeMessage(message)` | Serialize kind, request ID, name, payload, error flag, and error code into the agreed wire format. Do not transmit the local monotonic deadline. |
| `decodeMessage(payload)` | Validate and reconstruct those fields; return `std::optional<TEMPEST::Message>`, empty for malformed data. |

For example, the codec could use JSON inside a length/checksum radio frame. Both computers must use the same format. The [existing example transport](https://github.com/kemptonburton/dartwic-example-plugin/blob/main/engine/src/example_transport.cpp) demonstrates encoding and decoding the message envelope over a framed ZeroMQ link; replace its I/O with your radio driver.

On link loss, discard unsent frames and incomplete receive data; never replay accepted commands into a new connection. Serial-port availability alone does not prove the far end is reachable: the peer's registration and heartbeat establish readiness. Optional `diagnostics()` can expose queue depth and radio errors. Size queues and telemetry traffic for the available radio bandwidth.

## Connect the Engines

Install the plugin on both Engines, then select **Radio Link** in each Engine's Network Map:

| Setting | Engine A | Engine B |
| --- | --- | --- |
| Engine's own node name | `ENGINE_A` | `ENGINE_B` |
| Connection's remote `node_name` | `ENGINE_B` | `ENGINE_A` |
| Local radio port | The radio attached to A, for example `COM7`. | The radio attached to B, for example `COM4`. |
| Serial baud rate | Match A's radio configuration. | Match B's radio configuration. |

Use your platform's actual device path, such as `/dev/ttyUSB0` on Linux. Configure the radios themselves as a matching link. The Engine creates `Peer`, attaches `EngineProtocol`, and connects its handlers to RAPID/ARGUS. The plugin only supplies `RadioTransport`; it does not create another Engine peer or copy channel storage.

## C++ Application

To connect an application instead of a second Engine, reuse the same `RadioTransport` source. The application needs the shared SDK and your radio code, not the Engine plugin loader. Configure the Engine's radio connection to expect `FLIGHT_COMPUTER`, then create the application transport before its peer client:

```cpp
#include "RadioTransport.h"
#include <dartwic/EngineProtocolPeer.h>
#include <memory>

// Configure the application end of the radio link.
auto transport = std::make_shared<RadioTransport>(nlohmann::json{
    {"port", "COM4"},
    {"baud_rate", 115200}
});

// Use the shared Engine protocol over this link.
DARTWIC::EngineProtocolPeer peer({
    .node_name = "FLIGHT_COMPUTER",
}, transport);

// Register application handlers before starting.
peer.start();
peer.waitUntilReady();

// In your sampling loop, publish the reading and its source timestamp.
peer.channels().publishChannelTelemetry({
    .channel = "temperature",
    .fields = {.value = temperature, .timestamp = measuredAt, .units = "degC"}
});

// On application shutdown, before destroying handler state:
peer.stop();
```

This is a setup/publication/shutdown excerpt, not a complete sampling loop. Your application supplies `temperature` and its Unix-nanosecond `measuredAt`. `EngineProtocolPeer` creates the shared `Peer` and `EngineProtocol` around the transport you supplied. Its `channels()`, `argus()`, and `logs()` methods expose that protocol; they do not belong to the radio transport.

Follow the [C++ Engine Protocol Peer](../Clients/C%2B%2B%20Engine%20Protocol%20Peer.md) client for handlers, snapshots, and shutdown.

# Protocol Bridge

This plugin connects an Engine to a flight vehicle using its existing protocol. All code below runs in the **Engine plugin**. Sending and receiving refer to the plugin's vehicle link.

## Engine Registration

Start with `engine/src/my_plugin.cpp`. `MyPlugin` is your starter's `BasePlugin` subclass; keep its constructor and exports. This registers the connection type and the function that creates each bridge:

```cpp
#include "my_plugin.h"
#include "DeviceTransport.h"
#include <dartwic/EngineProtocol.h>
#include <memory>

void MyPlugin::onPluginLoaded() {
    // Register a device bridge that the Engine can instantiate.
    dartwic->registerPeer({
        .id = "device_link",
        .name = "Flight Vehicle",
        .default_config = {
            {"node_name", "FLIGHT_COMPUTER"},
            {"port", "COM7"},
            {"baud_rate", 115200}
        },
        .protocol_id = "tempest.engine",
        .protocol_version = DARTWIC::EngineContract::version,
        .engine_protocol = true,
        // Use the Engine-supplied peer and protocol inside the bridge.
        .create = [](const nlohmann::json& config,
                     TEMPEST::Peer& peer, DARTWIC::EngineProtocol& protocol) {
            return std::make_shared<DeviceTransport>(config, peer, protocol);
        }
    });
}
```

Selecting `my_plugin.device_link` in Network Map calls this factory with the saved settings. The Engine creates the connection and the vehicle's representative Peer and EngineProtocol. Your factory receives those objects. Registration alone does not open hardware.

| File you build | Purpose |
| --- | --- |
| `engine/src/my_plugin.cpp` | Register the connection type, as above. |
| `engine/include/DeviceTransport.h` and its source | Use the supplied Peer/EngineProtocol and register the mappings below. |
| Your `VehicleLink` and packet definitions | Device I/O, framing, decoding, command encoding, and reply correlation. |

Replace the serial settings with those your link needs, such as a TCP address and deployment dictionary.

## Transport and Protocol Setup

`protocol_` represents the vehicle: **publish decoded data into the Engine, and use handlers to translate Engine traffic into device packets.**

| Direction across the vehicle link | Plugin code |
| --- | --- |
| Vehicle telemetry → Engine | Decoder callback → `protocol_` publication. |
| Engine telemetry → vehicle | Protocol telemetry handler → vehicle encoder/write. |
| Vehicle command → Engine | Decoder callback → `protocol_` command → reply to vehicle. |
| Engine command → vehicle | Protocol command handler → vehicle encoder/write → result to Engine. |

The Engine connects Peer and EngineProtocol internally. `VehicleLink` handles your physical link.

`start()` opens your link. Report physical availability with `setConnected`; publish decoded data through EngineProtocol. Your TCP, serial, or radio receiver inside `VehicleLink` supplies the vehicle bytes:

```text
Vehicle bytes -> your decoder -> VehicleChannelPacket
              -> onChannelTelemetry handler -> protocol_.channels().publishChannelTelemetry(...)
              -> representative Peer -> Engine Peer
```

```cpp
class DeviceTransport : public TEMPEST::Transport {
public:
    DeviceTransport(const nlohmann::json& config,
                    TEMPEST::Peer& peer, DARTWIC::EngineProtocol& protocol)
        : vehicle_(config), peer_(peer), protocol_(protocol) {
        // Bind message translations before device I/O starts.
        registerChannels(); // Bodies are shown under Channels, Events, and Logs.
        registerEvents();
        registerLogs();
        registerOperations();
    }

    // Open the device link and report physical connection changes.
    void start() override {
        vehicle_.start([this](TEMPEST::ConnectionState state) {
            setConnected(state == TEMPEST::ConnectionState::Connected);
        });
    }

    // Cancel pending commands and join I/O before releasing bridge state.
    void stop() override {
        vehicle_.cancelPending();
        vehicle_.stop(); // Join device I/O and decoder callbacks.
    }
    ~DeviceTransport() override { stop(); }

private:
    void registerChannels();
    void registerEvents();
    void registerLogs();
    void registerOperations();

    // Run for a decoded vehicle request, on its command worker.
    void answerVehicleCommand(const auto& request, auto executeAndReply) {
        try {
            executeAndReply();
        } catch (const TEMPEST::RemoteError& error) {
            // Send an explicit rejection back to the vehicle.
            vehicle_.replyRejected(request, error.code(), error.what());
        } catch (const std::exception& error) {
            // Timeout/disconnection may happen after the Engine accepted a command.
            vehicle_.replyUnknown(request, error.what());
        }
    }

    VehicleLink vehicle_;
    TEMPEST::Peer& peer_;
    DARTWIC::EngineProtocol& protocol_;
};
```

Include the Peer, EngineProtocol, and your vehicle headers. The Engine owns the supplied Peer and protocol for this connection; they remain alive until your transport has stopped and its handlers have finished.

`VehicleLink` and `Vehicle...` packet types are your code. Its `on...` methods register decoder callbacks. Run commands on a separate bounded worker so waiting for the Engine leaves I/O and telemetry running.

For example, this excerpt shows where bytes enter your `VehicleLink`. `driver_` is your TCP/serial/radio driver; `decoder_` buffers partial CCSDS frames and emits decoded packets. Neither is a TEMPEST object:

```cpp
void VehicleLink::start(StateHandler onState) {
    // Decode incoming bytes, then deliver each complete channel packet.
    driver_.start(
        [this](Bytes bytes) {
            decoder_.accept(bytes, [this](VehicleChannelPacket packet) {
                if (channelTelemetryHandler_) channelTelemetryHandler_(packet);
            });
        },
        std::move(onState));
}

// Store the callback invoked by the decoder above.
void VehicleLink::onChannelTelemetry(ChannelHandler handler) {
    channelTelemetryHandler_ = std::move(handler);
}
```

The channel section below supplies `ChannelHandler`. Register equivalent handlers for decoded events, logs, and requests as needed. Raw vehicle bytes stay in your driver/decoder. `receive(message)` is for DARTWIC links; a device bridge publishes decoded measurements through EngineProtocol.

Replies keep the original request ID and connection session. Discard stale replies; report failed delivery locally without throwing or replaying. `cancelPending()` stops intake and fails device waits; `stop()` joins workers. Both must tolerate partial startup and repeated calls.

Combine each section's snippets into its `register...()` method. Each domain installs one handler object at the end; operations register directly on Peer. Include only supported mappings; missing command handlers return unsupported.

## Channels

Channel telemetry is the main flight-data path: temperatures, pressures, voltages, and other measurements. These snippets go inside `registerChannels()`.

### Receiving Telemetry

Your decoder identifies a channel packet and supplies its name, numeric value, units, and timestamp. Publish that observation into the Engine:

```cpp
// Prepare the channel bridge handlers.
DARTWIC::ChannelHandlers handlers;

vehicle_.onChannelTelemetry([this](const VehicleChannelPacket& packet) {
    // VEHICLE -> ENGINE: this is an observation, not a command.
    protocol_.channels().publishChannelTelemetry({
        .channel = packet.channel,
        .fields = {
            .value = packet.value,
            .timestamp = packet.timestampNs,
            .units = packet.units
        }
    });
});
```

`battery_voltage = 27.8 V` appears as `FLIGHT_COMPUTER:battery_voltage` in the Engine. The protocol supplies identity/session/revision. Publication is best effort, accepts single updates or sample batches, and requires no channel store.

Use Unix nanoseconds. If source time cannot be converted, use receive time and retain raw flight time separately.

### Sending Telemetry

When the Engine publishes channel observations, these handlers receive them in the plugin. Encode the data into whatever telemetry/input packet the vehicle accepts:

```cpp
// Forward Engine updates and complete channel snapshots to the vehicle.
handlers.channelTelemetry = [this](const DARTWIC::ChannelUpdates& updates) {
    vehicle_.writeChannelTelemetry(updates);
};

handlers.snapshotTelemetry = [this](const DARTWIC::ChannelSnapshot& snapshot) {
    vehicle_.writeChannelSnapshot(snapshot);
};
```

Forward supported channels with their ownership and timestamps. Filter reflected data to prevent echoes. Use bounded queues and split snapshots across frames when needed. Telemetry reports observations; it does not command channel changes.

### Receiving Commands

A decoded vehicle request can ask the Engine to change, query, or remove Engine channels. Call the same protocol command APIs as the C++ client, then encode the Engine's reply using the vehicle's request ID:

```cpp
// Route vehicle channel commands through the Engine protocol.
vehicle_.onChannelCommand([this](const VehicleChannelCommand& request) {
    answerVehicleCommand(request, [&] {
        using Kind = VehicleChannelCommand::Kind;
        switch (request.kind) {
        case Kind::Upsert:
            protocol_.channels().upsert(request.changes);
            vehicle_.replySuccess(request);
            break;

        // Queries return records instead of a simple success reply.
        case Kind::Query: {
            auto result = protocol_.channels().query(request.query);
            vehicle_.replyChannels(request, result);
            break;
        }

        case Kind::Remove:
            protocol_.channels().remove(request.channel);
            vehicle_.replySuccess(request);
            break;
        default:
            throw TEMPEST::RemoteError("Unsupported channel command", "unsupported");
        }
    });
});
```

Validate and map the request into `changes`, `ChannelQuery`, or a channel name for removal. Calls wait for the Engine's result. The reply helper reports rejection or unknown outcome on timeout/disconnection; do not automatically retry an unknown outcome.

### Sending Commands

Engine requests arrive through the protocol's command handlers. Translate them into vehicle commands or answer from data your adapter has retained:

```cpp
// Validate and deliver Engine channel commands to the device.
handlers.upsertCommand = [this](const DARTWIC::ChannelUpsertRequest& request) {
    auto packets = vehicle_.encodeChannelChanges(request); // Validate fields/ranges.
    vehicle_.writeCommands(packets);                      // Await write or throw.
};

// Answer queries and removals using the device's channel state.
handlers.queryCommand = [this](const DARTWIC::ChannelQuery& query)
    -> DARTWIC::ChannelQueryResult {
    return vehicle_.queryChannels(query);
};

handlers.removeCommand = [this](const DARTWIC::ChannelRemoveRequest& request) {
    vehicle_.removeChannel(request.channel);
};
```

Return to complete the request; throw `RemoteError` to reject it. A write confirms transmission, not execution; telemetry supplies feedback. Queries return current records, not graph history. Batches need not be atomic.

### Receiving Complete Channel Snapshots

A snapshot means **all channels currently shared by the vehicle**, including unchanged ones. If your decoder can produce that complete selection, publish it:

```cpp
// Reconcile the Engine mirror with the vehicle's complete channel set.
vehicle_.onChannelSnapshot([this](const DARTWIC::ChannelSnapshot& snapshot) {
    protocol_.channels().publishSnapshotTelemetry(snapshot);
});

// End of registerChannels(): install every selected handler together.
protocol_.channels().setHandlers(std::move(handlers));
```

Send complete snapshots on your own schedule, keeping original timestamps. Omitted channels are removed from the Engine's mirror; an empty snapshot clears it. Use normal telemetry for partial updates.

## Events

Events report vehicle conditions and support actions such as acknowledgement or prompt responses. These snippets form `registerEvents()`.

### Receiving Event Telemetry

Map a decoded flight event into an ARGUS event and publish it into the Engine:

```cpp
// Prepare callbacks for the event bridge.
DARTWIC::ArgusHandlers handlers;

// Forward decoded vehicle events to the Engine.
vehicle_.onEventTelemetry([this](const VehicleEventPacket& packet) {
    protocol_.argus().publishEventTelemetry({
        .event_id = packet.eventId,
        .type = vehicle_.eventType(packet.severity),
        .title = packet.name,
        .description = packet.text,
        .status = packet.status,
        .timestamp = packet.timestampNs,
        .firing_timeout_seconds = packet.separationSeconds
    });
});
```

Keep a stable event ID and original timestamp. Map severity to `Message`, `Warning`, `Error`, `Abort`, `Hold`, or `Prompt`; separation must be finite and nonnegative. Error text alone does not trigger an Engine abort or hold.

F Prime supplies the event ID, severity, arguments, and formatted text through its dictionary.

### Sending Event Telemetry

Receive Engine event updates or complete boards and encode them for a vehicle that supports that data:

```cpp
// Forward individual Engine events and complete boards to the vehicle.
handlers.eventTelemetry = [this](const DARTWIC::ArgusEvent& event) {
    vehicle_.writeEventTelemetry(event);
};

handlers.snapshotTelemetry = [this](const DARTWIC::ArgusBoardSnapshot& board) {
    vehicle_.writeEventSnapshot(board);
};
```

Preserve source IDs and ownership and filter reflected vehicle events. These describe Engine state; they do not command the vehicle to acknowledge an event or release a hold.

### Receiving Event Commands

A vehicle request can act on an Engine-owned event. Map its action, call the Engine, then return the action/query result over the vehicle link:

```cpp
// Route vehicle requests to the Engine's event owner.
vehicle_.onEventCommand([this](const VehicleEventCommand& request) {
    answerVehicleCommand(request, [&] {
        using Kind = VehicleEventCommand::Kind;

        // Queries return matching events rather than an action result.
        if (request.kind == Kind::Query) {
            vehicle_.replyEvents(request, protocol_.argus().query(request.query));
            return;
        }

        // Apply the requested event action.
        DARTWIC::ArgusActionResult result;
        switch (request.kind) {
        case Kind::UpdateStatus:
            result = protocol_.argus().updateStatus(request.eventId, request.status);
            break;
        case Kind::RespondToPrompt:
            result = protocol_.argus().respondToPrompt(request.eventId, request.response);
            break;
        case Kind::ReleaseHold:
            result = protocol_.argus().releaseHold(request.eventId, request.response);
            break;
        case Kind::Remove:
            result = protocol_.argus().remove(request.eventId);
            break;
        default:
            throw TEMPEST::RemoteError("Unsupported event action", "unsupported");
        }

        // Return the accepted action's result to the vehicle.
        vehicle_.replyEventAction(request, result);
    });
});
```

`status` is a string, such as `"acknowledged"`; `response` is a `DARTWIC::Value::Object`. The Engine validates its own lifecycle transitions. A prompt response, hold release, and removal are dedicated actions, not arbitrary status strings. See the [client event actions](../Clients/C%2B%2B%20Engine%20Protocol%20Peer.md#event-actions) for payload examples.

### Sending Event Commands

Engine actions on vehicle-owned events arrive through these handlers. The adapter sends the corresponding wire request or applies an explicitly supported adapter-owned action:

```cpp
// Let the device answer queries about its own events.
handlers.queryCommand = [this](const DARTWIC::ArgusQuery& query) {
    return vehicle_.queryEvents(query); // ArgusQueryResult
};

// Forward operator actions to the device.
handlers.updateStatusCommand = [this](const std::string& id, const std::string& status) {
    return vehicle_.updateEventStatus(id, status); // ArgusActionResult
};

handlers.respondToPromptCommand = [this](const std::string& id,
                                       const DARTWIC::Value::Object& response) {
    return vehicle_.respondToPrompt(id, response);
};

handlers.releaseHoldCommand = [this](const std::string& id,
                                   const DARTWIC::Value::Object& response) {
    return vehicle_.releaseHold(id, response);
};

handlers.removeCommand = [this](const std::string& id) {
    return vehicle_.removeEvent(id);
};
```

Return `ArgusActionResult` with `event_id` and a result object: `updated` for a confirmed change, or `sent` with `execution_confirmed: false` for transmission only. Reject unsupported actions with `RemoteError`; publish confirmed changes as telemetry.

### Receiving Complete Event Snapshots

If the vehicle or your adapter maintains a complete board, publish it to reconcile membership, including removals:

```cpp
// Reconcile the Engine mirror with the vehicle's current event board.
vehicle_.onEventSnapshot([this](const DARTWIC::ArgusBoardSnapshot& board) {
    protocol_.argus().publishSnapshotTelemetry(board);
});

// End of registerEvents().
protocol_.argus().setHandlers(std::move(handlers));
```

There is no separate event-removal telemetry. A successful removal command can update its caller's mirror; other mirrors reconcile on a complete snapshot. Do not label a partial event batch as a complete board.

## Logs

Logs are timestamped text streams. Their commands are stream listing and history queries; there are no log snapshots or acknowledgement actions. These snippets form `registerLogs()`.

### Receiving Log Telemetry

Publish decoded vehicle text into the Engine's logs:

```cpp
// Forward decoded vehicle log records to the Engine.
DARTWIC::LogHandlers handlers;

vehicle_.onLogTelemetry([this](const VehicleLogPacket& packet) {
    protocol_.logs().publishLogTelemetry({
        .stream = packet.stream,
        .level = packet.level,
        .text = packet.text,
        .timestamp_ns = packet.timestampNs
    });
});
```

`publishLogTelemetry` accepts one entry or a batch. Keep severity and source time; use the protocol's source/session/sequence identifiers when retaining history. F Prime also formats events as log entries.

### Sending Log Telemetry

Forward Engine log entries to a vehicle that accepts a logging/debug stream:

```cpp
handlers.logTelemetry = [this](const std::vector<DARTWIC::LogEntry>& entries) {
    vehicle_.writeLogTelemetry(entries);
};
```

Select supported streams, preserve source information, and avoid reflecting vehicle-originated entries back. Forwarding is best effort; it is not a guarantee of vehicle-side persistence.

### Receiving Log Queries

A vehicle request can list Engine log streams or query retained entries. Return the Engine's result with the original external request ID:

```cpp
// Answer vehicle log requests using the Engine's available history.
vehicle_.onLogCommand([this](const VehicleLogCommand& request) {
    answerVehicleCommand(request, [&] {
        using Kind = VehicleLogCommand::Kind;
        if (request.kind == Kind::List) {
            vehicle_.replyLogStreams(request, protocol_.logs().list());
        } else if (request.kind == Kind::Query) {
            vehicle_.replyLogs(request, protocol_.logs().query(request.query));
        } else {
            throw TEMPEST::RemoteError("Unsupported log query", "unsupported");
        }
    });
});
```

Your decoder builds `LogQuery` from the requested stream/session, filters, time or sequence bounds, and limit. Listing returns `std::vector<LogStream>`; querying returns `std::vector<LogEntry>`.

### Sending Log Queries

When the Engine asks for vehicle log history, answer from an external query or history retained by your adapter:

```cpp
// Expose the device's retained log sources and entries to the Engine.
handlers.listCommand = [this]() -> std::vector<DARTWIC::LogStream> {
    return vehicle_.listLogStreams();
};

handlers.queryCommand = [this](const DARTWIC::LogQuery& query)
    -> std::vector<DARTWIC::LogEntry> {
    return vehicle_.queryLogs(query);
};

// End of registerLogs().
protocol_.logs().setHandlers(std::move(handlers));
```

Register history handlers only when an archive is available. Apply requested filters/limits or reject unsupported queries.

## Operations

Use `registerOperations()` for commands outside channels and events. F Prime maps dictionary command names, opcodes, and argument types here.

### Sending Custom Commands

In `registerOperations()`, register each supported vehicle command on the bridge's Peer. `commandDescriptors()` is your adapter's dictionary-to-TEMPEST metadata mapping:

```cpp
// Expose each vehicle command as a peer operation.
for (const auto& descriptor : vehicle_.commandDescriptors()) {
    // Capture this command's name for its handler.
    const auto commandName = descriptor.name;
    peer_.registerOperation(descriptor,
        [this, commandName](const TEMPEST::Value::Object& arguments) {
            // Validate dictionary arguments, encode the command, and await write.
            vehicle_.sendCommand(commandName, arguments);

            // Report sending separately from confirmed device execution.
            return TEMPEST::Value::Object{
                {"status", "sent"},
                {"execution_confirmed", false}
            };
        });
}
```

Descriptors expose command names and argument metadata in the Engine's operation catalog. Peer matches replies automatically. `sendCommand` throws on invalid arguments or failed writes; success means `sent`.

Match device acknowledgements to pending commands. Either wait within a deadline and return the result, or publish later execution feedback as telemetry. Do not replay commands after timeout or reconnect.

### Receiving Custom Commands

If the vehicle protocol supports requests targeting Engine operations, translate them into a normal Peer call:

```cpp
// Forward a decoded vehicle operation to the connected peer.
vehicle_.onOperationCommand([this](const VehicleOperationCommand& request) {
    answerVehicleCommand(request, [&] {
        // request.name and arguments have been decoded and validated by the adapter.
        auto result = peer_.call(request.name, request.arguments);

        vehicle_.replyOperation(request, result);
    });
});
```

Use operation names from the connected Engine. The reply helper preserves request IDs and sessions and reports errors or unknown outcomes.

## F Prime Mapping Example

The F Prime source shows the concrete jobs your adapter owns:

| Vehicle input or Engine request | Plugin mapping |
| --- | --- |
| CCSDS channel packet | Dictionary channel ID/type → numeric value and channel name → channel telemetry into the Engine. |
| CCSDS event packet | Dictionary event definition/severity/arguments → ARGUS event and, if desired, a formatted log entry. |
| Engine dictionary operation | Named command and typed arguments → opcode/encoded arguments → CCSDS telecommand → correlated result. |
| External timestamps | Keep flight time and receive time distinct; do not label an unmapped flight clock as Unix time. |

See [FprimeTransport.cpp](https://github.com/kemptonburton/fprime-dartwic-plugin/blob/main/engine/src/FprimeTransport.cpp) for packet mappings. Its peer type is `fprime_bridge.fprime_ccsds`, with deployment dictionary/TCP/CCSDS settings. Reverse commands and telemetry depend on what your vehicle supports.

# Custom Operations and Telemetry

Generic operations and custom telemetry can coexist with the DARTWIC domain APIs through the peer's normal registration/publication methods.

For a wholly separate application protocol, set `engine_protocol = false`, choose matching protocol IDs/versions, and use the registration's `configure(TEMPEST::Peer&)` callback. That route requires explicit plugin integration to populate RAPID or ARGUS. See the [peer definition reference](Reference/Engine/TEMPEST/PeerDefinition.md) for registration fields.

# Interface Configuration

Install the plugin, restart the Engine, and create a connection in [Network Map](../Interface/Network%20Map.md) using its registered type. Supply a unique remote node name and the endpoints or device settings expected by the factory.

For a custom transport, match framing and peer/protocol IDs at both ends. For a bridge, match the actual device dictionary and packet format. Check values, units, timestamps, operations, and errors; a connected badge does not prove fresh data or command execution.

# Building and Installation

Follow [Packaging and Installation](Packaging%20and%20Installation.md) for build tools, deployment, and dependencies.

Before releasing the implementation, test through a real Engine connection using the registered peer type:

| Exercise | Verify |
| --- | --- |
| Registration | Saved settings reach the factory; incompatible identities/versions fail clearly. |
| Channels | Values, units, owner, timestamps, sample batches, and query selections survive the complete path. |
| Snapshots | Original timestamps remain; complete snapshots reconcile removals; partial packets never clear valid data. |
| Commands | Arguments reach the device, replies match requests, unsupported actions fail, and acceptance differs from execution. |
| Events and logs | Identity, status, severity, timestamps, and sequences survive; supported actions/history work. |
| Load and bad input | Queues stay bounded, malformed frames are rejected, deadlines expire, and replies/heartbeats still progress. |
| Reconnect and stop | Sessions change, old commands are not replayed, fresh state resumes, and callbacks end before teardown. |

Run Engine peer regressions, custom transport tests, and F Prime bridge tests to verify the complete integration.

# Reference

- [C++ Engine Protocol Peer](../Clients/C%2B%2B%20Engine%20Protocol%20Peer.md) — The same domain APIs and handlers in an application.
- [Device registration](Reference/Engine/TEMPEST/SDK_API-registerPeer.md) and [transport registration](Reference/Engine/TEMPEST/SDK_API-registerPeerTransport.md).
- [Transport interface](Reference/TEMPEST/Messaging/Transport.md).
- [Engine Protocol reference](Reference/TEMPEST/Engine%20Protocol/Overview.md).
