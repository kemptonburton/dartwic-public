---
title: PeerClient
summary: A Peer and EngineProtocol with optional default ZeroMQ transport.
created: 2026-10-27T14:08
updated: 2026-10-27T16:09
---

## API

A Peer and EngineProtocol with optional default ZeroMQ transport. Register handlers before start. Application state must outlive stop/destruction. No channel/event/log storage is supplied or required.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/PeerClient.h>
```

## Declaration

```cpp
class PeerClient {
public:
    explicit PeerClient(PeerClientConfig config,
                          TEMPEST::TransportPtr transport = {});
    ~PeerClient();
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
