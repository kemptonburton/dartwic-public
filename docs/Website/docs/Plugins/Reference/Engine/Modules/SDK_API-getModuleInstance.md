---
title: "SDK_API::getModuleInstance"
summary: "Returns a live module instance by configured instance name."
---

## Declaration

```cpp
virtual std::shared_ptr<Modules::BaseModule> getModuleInstance(const std::string& instance_name) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `instance_name` | Configured module instance name. |

## Returns

The live module instance, or null when it is unavailable.
