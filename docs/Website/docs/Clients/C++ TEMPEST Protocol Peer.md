---
summary: Exchange custom commands and telemetry with a C++ peer over TEMPEST TCP.
created: 2026-10-27
updated: 2026-10-28T20:06
---

Use a TEMPEST Protocol Peer when your application needs a few custom commands or telemetry topics, and dont want the full Engine Protocol in your peer. You implement the handlers and payloads; `TEMPEST::Peer` handles registration, requests, replies, and dispatch. The built-in TEMPEST transport carries those messages over ZeroMQ/TCP. You do not need to implement a transport.

Choose **TEMPEST Protocol Peer — TEMPEST TCP** in Network Map. This option uses TEMPEST operations and telemetry without the Engine protocol's channel, event, and log integration. For those features, use [C++ Engine Protocol Peer](C%2B%2B%20Engine%20Protocol%20Peer.md). Both options use the same transport implementation, and both can send and receive custom commands and telemetry.

# Project Setup

The C++ Peer Client package supplies the TEMPEST peer implementation and its CMake target. Extract it into your application's `vendor/dartwic-peer/` directory. Use package 3.0.0 with Engine 2.1.0 or newer, a C++20 compiler, and the package's ZeroMQ dependencies:

```cmake
cmake_minimum_required(VERSION 3.20)
project(custom_peer LANGUAGES CXX)
add_subdirectory(vendor/dartwic-peer)
add_executable(custom_peer main.cpp)
target_link_libraries(custom_peer PRIVATE TEMPEST::Peer)
```

Installed consumers use `find_package(TEMPESTPeer CONFIG REQUIRED)` and the same target. This program uses `TEMPEST::Peer` directly; it does not construct `DARTWIC::EngineProtocolPeer` or attach `EngineProtocol`.

# Peer Setup

This example connects as `CUSTOM_APP` and exchanges ten samples with the Engine plugin below. Save it as `main.cpp`. The package also includes it as `examples/tempest_peer.cpp`.

```cpp
#include <tempest/Peer.h>
#include <tempest/JsonValue.h>
#include <tempest/ZmqPeer.h>
#include <tempest/InternalVersions.h>
#include <chrono>
#include <cstdlib>
#include <iostream>
#include <syncstream>
#include <thread>

// Run against an Engine with the peer_demo plugin from the companion guide.
int main(int argc, char** argv) {
    try {
        // Read credentials for the Engine connection.
        const char* password = std::getenv("DARTWIC_PASSWORD");
        if (!password) throw std::runtime_error("Set DARTWIC_PASSWORD first.");

        // Select the remote Engine and, when needed, our advertised address.
        TEMPEST::ZmqPeerConfig connection;
        connection.password = password;
        if (argc > 1) connection.host = argv[1];
        if (argc > 2) connection.port = std::stoi(argv[2]);
        // On different machines, supply this application's reachable local address.
        if (argc > 3) {
            connection.bind_host = "0.0.0.0";
            connection.advertised_host = argv[3];
        }

        // Give this application its own peer identity and transport.
        TEMPEST::Peer peer({
            .node_name="CUSTOM_APP", .peer_id="tempest.peer",
            .protocol_id="tempest.peer", .protocol_version=TEMPEST::COMPATIBILITY_VERSION
        }, TEMPEST::makeZmqTransport(connection));

        // Receive commands: the Engine can call this application's handler.
        peer.registerOperation("demo/echo", [](const TEMPEST::Value::Object& args) {
            std::osyncstream(std::cout) << "Received command: " << TEMPEST::Json::fromObject(args).dump() << '\n';
            return args;
        });

        // Receive telemetry from the Engine plugin.
        peer.onTelemetry("peer_demo.status", [](const TEMPEST::Value::Object& data) {
            std::osyncstream(std::cout) << "Received telemetry: " << TEMPEST::Json::fromObject(data).dump() << '\n';
        });

        // Complete registration before sending commands or observations.
        peer.start();
        peer.waitUntilReady();

        // Exchange new samples after initial peer registration.
        for (int sample = 0; sample < 10; ++sample) {
            // Send telemetry; the Engine relays this topic to its ordinary clients.
            peer.publish("demo/reading", {{"sample", sample}, {"temperature", 24.5}});
            // Send a command; each loop is a new explicit request, not a retry.
            const auto reply = peer.call("peer_demo.exchange", {{"sample", sample}}, std::chrono::seconds{5});
            std::osyncstream(std::cout) << "Command reply: " << TEMPEST::Json::fromObject(reply).dump() << '\n';
            std::this_thread::sleep_for(std::chrono::milliseconds{200});
        }

        // Finish peer I/O before the handlers go out of scope.
        peer.stop();
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
```

# Commands

Commands are request and reply messages. Use them when the caller needs the other side to perform an action and report success or an error. The application can call an Engine operation, and it can expose its own operation for the Engine to call.

## Sending Commands

In `main.cpp`, after `peer.waitUntilReady()`, call the operation registered by the Engine plugin below. `sample` is the input to that handler, and `reply` is the object it returns:

```cpp
const auto reply = peer.call("peer_demo.exchange", {{"sample", sample}}, std::chrono::seconds{5});
std::osyncstream(std::cout) << TEMPEST::Json::fromObject(reply).dump() << '\n';
```

`call()` waits for the result or an error. You can also call existing Engine operations without adding a plugin. For a new custom Engine-side operation, implement and register the handler in an [Engine Plugin](../Plugins/Engine%20Plugin.md).

A timeout after submission leaves completion unknown. Peer does not replay the command; inspect the authoritative state before deciding to issue another request. A response confirms what the handler reports, not an independent physical measurement.

## Receiving Commands

Register a handler in `main.cpp` before `peer.start()` so the Engine can call the application's `demo/echo` operation. The handler returns its input as the reply; the complete example above also prints the received arguments:

```cpp
peer.registerOperation("demo/echo", [](const TEMPEST::Value::Object& args) {
    return args;
});
```

The Engine plugin calls this operation while processing `peer_demo.exchange`. Peer dispatches incoming requests separately from reply processing, so the outgoing call can complete while the application receives this reverse command. Exceptions from the handler reject the request.

# Telemetry

Telemetry carries observations without waiting for a reply. Use it for samples or status that another participant should see, while keeping commands for work that needs a result.

## Sending Telemetry

In `main.cpp`, after `peer.waitUntilReady()`, publish one sample on the custom topic. The loop in the complete example publishes a new observation for each `sample`:

```cpp
peer.publish("demo/reading", {{"sample", sample}, {"temperature", 24.5}});
```

`publish("demo/reading", payload)` sends a custom observation after registration. The Engine relays received custom topics to its ordinary clients. This does not create a channel or store samples in RAPID. Use the Engine Protocol Peer for that integration, or send an operation to your Engine plugin when you need it to process and store a payload.

Telemetry is best effort. There is no acknowledgement or automatic history; consumers may miss samples during startup, congestion, or disconnection. The repeated publications above are new observations.

## Receiving Telemetry

Register the callback in `main.cpp` before `peer.start()` to receive the Engine plugin's `peer_demo.status` topic:

```cpp
peer.onTelemetry("peer_demo.status", [](const TEMPEST::Value::Object& data) {
    std::osyncstream(std::cout) << TEMPEST::Json::fromObject(data).dump() << '\n';
});
```

`onTelemetry()` subscribes to the custom topic published by the Engine plugin. The callback runs on a Peer worker; synchronize access to shared application state and keep callbacks bounded. In the complete example, the published status contains the same sample sent to `peer_demo.exchange`.

# Engine Handlers

The C++ application registers only its own `demo/echo` handler. The Engine needs a handler of its own to accept `peer_demo.exchange`, publish `peer_demo.status`, and call back into the application. An Engine plugin supplies that application-specific behavior through the Engine's existing operation and telemetry APIs. If you only call built-in Engine operations or consume existing topics, you do not need this demo plugin.

Start from the [Engine Plugin](../Plugins/Engine%20Plugin.md) template in your Engine plugin project and set the plugin manifest ID to `peer_demo`. Add these registrations to the plugin's `onPluginLoaded()` method. The host supplies the `dartwic` API pointer; the existing plugin loader owns registration and cleanup.

```cpp
// Describe the status topic exposed by this plugin.
dartwic->registerTelemetry(DARTWIC::API::TelemetryDefinition{
    .id = "status",
    .name = "Peer demo status",
    .description = "Sample received by the exchange operation.",
    .delivery = "Published when exchange runs."
});
// Handle the application request and exchange data in both directions.
dartwic->registerOperation("exchange", "Exchange sample",
    [this](const nlohmann::json& payload) {
        // Validate the request before publishing or calling the application.
        if (!payload.is_object() || !payload.contains("sample")) {
            throw std::invalid_argument("An object containing sample is required.");
        }

        // Engine -> application telemetry, qualified as peer_demo.status.
        dartwic->publishTelemetry("status", payload);

        // Engine -> application command; return its response to the original caller.
        return dartwic->callTempest("CUSTOM_APP", "demo/echo", payload);
    });
```

The plugin namespace qualifies `exchange` as `peer_demo.exchange` and `status` as `peer_demo.status`. Pass the local topic ID to `publishTelemetry`; pass the fully qualified remote operation to `callTempest`. The remote node name must match the application's `node_name` exactly.

Install the built plugin and load it in the Engine before running the application. No peer type or custom transport registration is needed. Use the current Engine SDK and minimum Engine 2.1.0; this code uses the existing plugin ABI.

# Build and Run

Build the application after adding `main.cpp` and the package to your project. The Engine plugin must be installed and loaded before this example can complete its custom exchange, because it provides `peer_demo.exchange` and `peer_demo.status`. Build the application using your dependency toolchain:

```sh
cmake -S . -B build
cmake --build build --config Debug
```

Set `DARTWIC_PASSWORD` to the Engine password, then run `custom_peer 127.0.0.1 7200` (or your configured Engine host and base port). The application initiates the connection, so a second reciprocal connection is unnecessary. Network Map should show `CUSTOM_APP` with the TEMPEST Protocol Peer connection type. The program prints received commands, telemetry, and command replies, then stops.

On different machines, supply a third argument with the application's reachable local address. The example binds its standalone sockets on all interfaces and advertises that address; allow the configured transport endpoints through the firewall. The Engine reuses its existing ROUTER/PUB sockets and subscription hub. The standalone application owns its own transport sockets.

`waitUntilReady()` waits for registration and throws if its timeout expires. `stop()` cancels pending work and joins the peer workers. Call it before destroying any state captured by handlers. The example uses synchronized output because callbacks and the main thread can print concurrently.

For lifecycle methods, operation metadata, and transport settings, see the [TEMPEST peer reference](Reference/TEMPEST/Overview.md).
