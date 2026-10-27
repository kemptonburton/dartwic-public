---
title: "PeerTransportDefinition"
summary: "A custom link carrying DARTWIC messages. Engine creates Peer and protocol."
---

## Declaration

```cpp
struct PeerTransportDefinition {
        std::string id;
        std::string name;
        uint64_t version = 1;
        nlohmann::json default_config = nlohmann::json::object();
        std::string protocol_id = "tempest.engine";
        uint64_t protocol_version = DARTWIC::Plugins::TEMPEST_COMPATIBILITY_VERSION;
        bool engine_protocol = true;
        std::function<TransportPtr(const nlohmann::json&)> create;
        std::function<void(TEMPEST::Peer&)> configure;
    };
```
