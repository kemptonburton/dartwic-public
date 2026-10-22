---
title: "OperationDefinition"
summary: "Registers an executable plugin operation and its operator-facing metadata."
---

## Declaration

```cpp
struct OperationDefinition {
        std::string id;
        std::string name;
        std::string description;
        std::string category;
        std::vector<OperationArgumentDefinition> arguments;
        OperationHandler handler;
        bool allow_viewers = false;
    };
```
