---
title: ZmqPeerHub
summary: Reuse an engine server ROUTER/PUB and own one shared SUB plus one DEALER per logical peer connection.
created: 2026-09-26T01:43
updated: 2026-10-04T04:46
---

## API

Reuse an engine server ROUTER/PUB and own one shared SUB plus one DEALER per logical peer connection.

Namespace: `TEMPEST`.

```cpp
#include <tempest/ZmqPeer.h>
```

## Declaration

```cpp
class ZmqPeerHub {
public:
    struct Config {
        std::string operations_endpoint;
        std::string telemetry_endpoint;
        std::string password;
        std::size_t max_peers = 128;
        std::size_t max_queued_messages = 4096;
    };
    using AcceptHandler = std::function<void(TransportPtr, PeerDeclaration)>;
    using RouterSender = std::function<void(std::string identity, std::string wire)>;
    using Publisher = std::function<void(std::string topic, std::string wire)>;
    ZmqPeerHub(Config config, RouterSender router, Publisher publisher, AcceptHandler accept);
    ~ZmqPeerHub();
    void start();
    void stop();
    bool receive(std::string identity, std::string wire);
    TransportPtr connect(ZmqPeerConfig config);
    nlohmann::json diagnostics() const;
};
```
