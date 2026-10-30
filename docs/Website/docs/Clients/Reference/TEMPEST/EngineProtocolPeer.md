---
title: EngineProtocolPeer
summary: Shared EngineProtocol + TEMPEST Peer composition used by the Engine and C++ applications.
created: 2026-10-27T17:53
updated: 2026-10-27T17:56
---

## API

Shared EngineProtocol + TEMPEST Peer composition used by the Engine and C++ applications. The configuration constructor owns a standalone Peer and stops it on destruction. The shared-Peer constructor attaches to an existing server-owned Peer without creating a transport or taking over its lifecycle. Register handlers before the owner starts the Peer, and stop/join the Peer before destroying application handler state. Commands wait for a response or throw; timeouts can leave the remote outcome unknown. Telemetry is best effort. No channel/event/log storage is supplied or required.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineProtocolPeer.h>
```

## Declaration

```cpp
class EngineProtocolPeer {
public:
    explicit EngineProtocolPeer(EngineProtocolPeerConfig config,
                          TEMPEST::TransportPtr transport = {});
    // Attach to a nonnull server Peer before it starts. Retains the Peer, preserves its transport and fallbacks, and leaves start/stop with the server. The host validates the registered protocol identity and version. Throws invalid_argument for a null Peer.
    explicit EngineProtocolPeer(std::shared_ptr<TEMPEST::Peer> peer);
    ~EngineProtocolPeer();
    EngineProtocolPeer(const EngineProtocolPeer &) = delete;
    EngineProtocolPeer &operator=(const EngineProtocolPeer &) = delete;
    // The same underlying Peer, for custom messaging and diagnostics.
    TEMPEST::Peer &peer();
    const TEMPEST::Peer &peer() const;
    void start();
    void stop();
    bool ready() const;
    void waitUntilReady(
          std::chrono::milliseconds timeout = std::chrono::seconds(5)) const;
    std::string sessionId() const;
    std::string remoteSession() const;
    std::string remoteNode() const;
    void onStateChanged(
          std::function<void(TEMPEST::ConnectionState, std::string)> handler);
    EngineProtocol::Channels &channels();
    EngineProtocol::Argus &argus();
    EngineProtocol::Logs &logs();
    void registerOperation(std::string name,
                             TEMPEST::Peer::OperationHandler handler);
    void registerOperation(TEMPEST::OperationDescriptor descriptor,
                             TEMPEST::Peer::OperationHandler handler);
    void onTelemetry(std::string topic, TEMPEST::Peer::TelemetryHandler handler);
    void publish(std::string topic, Value::Object payload);
    void registerTelemetry(TEMPEST::TelemetryDescriptor descriptor);
    Value::Object call(std::string name, Value::Object arguments = {},
                         std::chrono::milliseconds timeout = {});
};
```
