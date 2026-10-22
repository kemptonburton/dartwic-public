---
title: "OperationArgumentDefinition"
summary: "A typed argument in a peer-visible command descriptor."
---

## Declaration

```cpp
struct OperationArgumentDefinition {
        std::string name;
        std::string type;
        std::string description;
        bool required = false;
        std::optional<nlohmann::json> default_value;
        std::vector<nlohmann::json> choices;
    };
```
