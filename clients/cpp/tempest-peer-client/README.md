# C++ TEMPEST peer client

`DARTWIC::PeerClient` connects your application as a named node. It assembles the same Transport, Peer and EngineProtocol used by the Engine. Register the handlers you need; application storage is optional and application-owned.

Use CMake 3.20+, C++20, cppzmq and nlohmann_json. Build from this directory with your dependency toolchain:

```sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
cmake --build build --config Release --target TEMPESTPeer_Example
cmake --install build --config Release --prefix ./install
```

Installed consumers use `find_package(DARTWICPeerClient CONFIG REQUIRED)` and link `DARTWIC::PeerClient`. Source consumers add this directory with `add_subdirectory` and link the same target. Set `CMAKE_PREFIX_PATH` to your installed package and dependencies.

`examples/peer.cpp` shows a command handler and channel telemetry. Call `start()`, then `waitUntilReady()` before requests/publications. Call `stop()` before destroying handler state. A request timeout leaves remote completion unknown; commands are never automatically replayed.

For a custom link, pass a `shared_ptr<TEMPEST::Transport>` as the constructor's second argument and register the matching Engine transport through a plugin. See the [C++ TEMPEST Peer guide](../../../docs/Website/docs/Clients/C%2B%2B%20TEMPEST%20Peer.md) for channels, events, logs and complete setup examples. Lower-level `TEMPEST::Peer` and `DARTWIC::EngineProtocol` remain available separately.
