---
title: "ModuleTypeDefinition"
summary: "Declares a module type that a plugin can instantiate."
---

## Declaration

```cpp
struct ModuleTypeDefinition {
        std::string id;
        std::string name;
        std::string config_path = "module_config.json";
        std::string default_parameters_path = "default_parameters.json";
    };
```
