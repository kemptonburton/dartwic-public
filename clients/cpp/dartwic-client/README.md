# DARTWIC C++ Client

A C++20 wrapper around TEMPEST for connections, channels, telemetry and recorded data. This is the operation/data client; the existing C++ TEMPEST peer client is a separate node-to-node API.

Copy this folder from the public repository or extract its release ZIP. No other DARTWIC source folder is required.

Download **C++ Client** from the DARTWIC Downloads page and extract the source archive, which bundles TEMPEST. Install CMake 3.20+, a C++20 compiler, and the `cppzmq` and `nlohmann_json` CMake packages (for example through vcpkg). From the extracted release directory, configure with your toolchain, build, and install:

```sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
cmake --install build --config Release --prefix ./install
```

Consumers use `find_package(DARTWICClient CONFIG REQUIRED)` and link `DARTWIC::Client`. Point `CMAKE_PREFIX_PATH` at the install prefix. On Windows use the same architecture and runtime configuration for your application and dependencies. The `DARTWICClient_Example` target demonstrates connection and history access. See **Clients → C++ Client** on the website for the guide and generated API reference. TEMPEST's registration/heartbeat workers automatically reconnect; subscriptions are restored before `connected()` becomes true. Keep the client alive until callbacks finish, and disconnect from the application thread.
