---
summary: Build a native application with live channels, telemetry, and history queries.
updated: 2026-10-14T22:35
created: 2026-09-07T17:03
---

Use `DARTWIC::Client` for ordinary engine operations and analysis tools. It wraps the existing TEMPEST C++ client. Use the [C++ TEMPEST peer client](C%2B%2B%20TEMPEST%20Peer.md) when your application participates as a TEMPEST peer node and exposes its own channels or ARGUS handlers.

## Build and install

Download **C++ Client** from [Downloads](/areas/dartwic/downloads). The source archive includes TEMPEST; no separate transport package is needed. Install CMake 3.20 or newer, a C++20 compiler, cppzmq/ZeroMQ, and nlohmann JSON. CMake also locates platform thread support. A Windows build can use Visual Studio 2022's C++ tools and Windows SDK; GCC or Clang with C++20 support can build on other platforms.

With those dependencies discoverable by CMake, run inside the extracted directory:

```sh
cmake -S . -B build -DCMAKE_INSTALL_PREFIX=./installed
cmake --build build --config Release
cmake --install build --config Release
```

If using vcpkg, pass its `CMAKE_TOOLCHAIN_FILE` during configuration. Otherwise use `CMAKE_PREFIX_PATH` for dependencies installed outside standard locations. Shared ZeroMQ builds also need the corresponding DLL/shared library available when the application runs.

Your application's `CMakeLists.txt` can then use the installed package:

```cmake
cmake_minimum_required(VERSION 3.20)
project(analysis LANGUAGES CXX)
find_package(DARTWICClient CONFIG REQUIRED)
add_executable(analysis main.cpp)
target_link_libraries(analysis PRIVATE DARTWIC::Client)
```

Configure the application with `CMAKE_PREFIX_PATH` pointing to the client install prefix and its dependency prefixes. The target carries the C++20 requirement.

## Connect

Set `DARTWIC_PASSWORD`. Put the following snippets inside the connected scope, using your actual channel names:

```cpp
#include <dartwic/DartwicClient.h>
#include <cstdlib>
#include <iostream>
#include <stdexcept>

int main() {
    try {
        const char* password = std::getenv("DARTWIC_PASSWORD");
        if (!password) throw std::runtime_error("Set DARTWIC_PASSWORD");
        DARTWIC::Client::DartwicClient client({
            .host = "127.0.0.1", .port = 7000, .password = password,
        });
        client.connect();
        // Query, write, or subscribe here.
        client.disconnect();
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
```

`connect()` registers, checks compatibility, and starts workers. Calls block until a reply or error. Concurrent requests use TEMPEST's bounded queue; the wire timeout starts after queueing. An operation failure can trigger reconnect, so wait for `connected()` before issuing further requests.

## Query channels

```cpp
std::cout << client.queryChannel("tank_pressure") << '\n';
std::cout << client.queryChannel("tank_pressure", "units") << '\n';
auto records = client.getChannels({"tank_pressure", "tank_temperature"});
for (const auto& [name, record] : records.items()) {
    if (record.at("exists").get<bool>())
        std::cout << name << ": " << record.at("channel_data").at("value") << '\n';
}
```

A single read throws for a missing channel or field; batch reads expose `exists`. This live-read endpoint rounds values to three decimals.

## Search channels

```cpp
auto matches = client.searchChannels("tank", 25);
if (!matches.empty()) std::cout << client.getChannels(matches).dump(2);
```

## Upsert channels

```cpp
client.upsertChannel("analysis_result", 42.0);
client.upsertChannel("analysis_result", "bar", "units");
```

For a device adapter with several readings, write each named value:

```cpp
nlohmann::json readings = {{"adapter_pressure", 2.5}, {"adapter_temperature", 23.5}};
for (const auto& [channel, value] : readings.items())
    client.upsertChannel(channel, value);
```

Each call is an acknowledged write, not an atomic batch. Earlier writes remain applied if a later call fails. Engine authority applies. Use the [TEMPEST peer client](C%2B%2B%20TEMPEST%20Peer.md) when your application owns remote channels, receives commands, or sends timestamped telemetry batches.

## Subscribe and receive telemetry

```cpp
auto token = client.subscribeChannel("tank_pressure", [](const%20nlohmann%3A%3Ajson%26%20snapshot) {
    if (snapshot.at("exists").get<bool>())
        std::cout << snapshot.at("channel_data").at("value") << '\n';
});
std::cin.get(); // Keep the connection alive until Enter.
client.unsubscribe(token);
```

The initial snapshot runs on the caller; updates run on the receive worker and can overlap setup. Protect shared state, keep callbacks short, and disconnect outside callbacks. Multiple listeners share one server reference; repeated unsubscribe is harmless. Update callback exceptions are isolated.

For raw envelopes, bind a prefix before enabling the channel stream:

```cpp
auto raw = client.subscribeTelemetry("rapid/channels/", [](const%20nlohmann%3A%3Ajson%26%20message) {
    std::cout << message.dump() << '\n';
});
auto channel = client.subscribeChannel("tank_pressure", [](const%20auto%26) {});
std::cin.get();
client.unsubscribe(channel);
client.unsubscribe(raw);
```

A raw subscription is only a local binding; it does not enable engine publication.

## Example: query a saved view's channels

```cpp
auto frames = client.listDataframes();
for (const auto& frame : frames) {
    if (frame.at("name") != "tank_run") continue;
    auto page = client.operation("rapid/dataframes/channels",
        {{"id", frame.at("id")}, {"query", "pressure"}, {"limit", 100}});
    std::vector<std::string> selected;
    for (const auto& item : page.at("entries"))
        if (item.at("has_history")) selected.push_back(item.at("channel"));
    if (selected.empty()) throw std::runtime_error("No recorded pressure channels");
    DARTWIC::Client::HistoryQuery query;
    query.from = frame.at("from_ns").get<std::uint64_t>();
    query.to = frame.contains("to_ns") ? frame.at("to_ns").get<std::uint64_t>() : std::nullopt;
    auto history = client.queryChannelRange(selected, query);
    for (const auto& channel : history.at("channels"))
        for (const auto& point : channel.at("points"))
            std::cout << channel.at("channel_reference") << ',' << point.at("timestamp") << ',' << point.at("value") << '\n';
}
```

Channel catalog pages contain at most 200 entries. Raw history has a server point limit; `bucket_count` and `bucket_mode` request an aggregated preview. Timestamps retain 64-bit nanosecond precision.

## Raw operations and reconnect

```cpp
auto metadata = client.operation("dartwic/get-runtime-metadata");
std::cout << metadata.at("engineVersion");
```

`operation` returns the payload and throws on server, transport, queue, or timeout errors. A timeout does not cancel engine work, and operations are never automatically replayed.

TEMPEST automatically registers again after detected connection/session loss. The wrapper verifies compatibility and restores managed channel subscriptions before `connected()` becomes true. Telemetry is best effort: reconnect cannot recover updates missed while offline; query current state or recorded history when needed.

Serialize lifecycle calls. Call `disconnect()` and destroy the client **outside telemetry callbacks**, after application work using the client has finished. Keep callbacks short, and keep captured objects alive until shutdown completes. Explicit disconnect clears subscriptions; a later explicit connect starts a fresh session. `connected()` reflects local readiness rather than proving network reachability at that instant.

See the generated [C++ API reference](Reference/C%2B%2B/Overview.md) and [Using TEMPEST](../Engine/Using%20TEMPEST.md).
