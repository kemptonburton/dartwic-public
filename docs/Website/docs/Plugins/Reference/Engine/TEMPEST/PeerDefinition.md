---
title: "PeerDefinition"
summary: "One operator-selectable peer with a fixed protocol and transport."
---

## Declaration

```cpp
struct PeerDefinition {
        std::string id;
        std::string name;
        uint64_t version = 1;
        nlohmann::json default_config = nlohmann::json::object();
        std::string protocol_id = "tempest.peer";
        uint64_t protocol_version = 1;
        bool engine_protocol = false;
        std::function<TransportPtr(const nlohmann::json& config)> create;
        std::function<void(TEMPEST::Peer& peer)> configure;
    };
```
