# C++ TEMPEST peer client

Run a TEMPEST node with operations and telemetry using `TEMPEST::Peer`. This folder includes its messaging library and ZeroMQ transport; no private DARTWIC checkout or SDK download is needed to build it.

Install CMake 3.20+, a C++20 compiler, and the `cppzmq` and `nlohmann_json` CMake packages, for example through vcpkg. Configure with your dependency toolchain or `CMAKE_PREFIX_PATH`, then build and install from this folder:

```sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
cmake --build build --config Release --target TEMPESTPeer_Example
cmake --install build --config Release --prefix ./install
```

Consumers use `find_package(TEMPESTPeer CONFIG REQUIRED)` and link `TEMPEST::Peer`. Point `CMAKE_PREFIX_PATH` at the install prefix and third-party dependencies. On Windows, use matching architectures and runtime configurations.

`examples/peer.cpp` shows registration, an echo operation and a telemetry handler. Registration and network work run asynchronously; `waitUntilReady` waits for connection readiness. Keep the peer alive while handlers run and call `stop` before destroying application state used by callbacks. A timeout does not prove a remote operation was canceled.

For engine-specific channels, events and logs, add the separate [Engine Protocol SDK](https://github.com/kemptonburton/dartwic-public/tree/main/sdk/dartwic-engine-protocol). For an application that only queries an engine, use the ordinary C++ DARTWIC client instead.
