---
title: PeerDefinition
summary: One operator-selectable peer with a fixed protocol and transport.
created: 2026-10-04T18:31
updated: 2026-10-27T14:08
---

## Declaration

```cpp
struct PeerDefinition {
        std::string id;
        std::string name;
        uint64_t version = 1;
        nlohmann::json default_config = nlohmann::json::object();
        std::string protocol_id = "tempest.engine";
        uint64_t protocol_version = DARTWIC::Plugins::TEMPEST_COMPATIBILITY_VERSION;
        bool engine_protocol = true;
        std::function<TransportPtr(const nlohmann::json&, TEMPEST::Peer&, DARTWIC::EngineProtocol&)> create;
        std::function<void(TEMPEST::Peer&)> configure;
        // Host-normalized transport-only registration. Use registerPeerTransport.
        std::function<TransportPtr(const nlohmann::json&)> create_transport;
    };
```
