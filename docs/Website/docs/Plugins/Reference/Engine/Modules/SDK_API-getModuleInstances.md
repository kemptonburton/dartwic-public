---
title: "SDK_API::getModuleInstances"
summary: "Lists live module instances, optionally limited to one plugin."
---

## Declaration

```cpp
virtual std::vector<ModuleInstanceSummary> getModuleInstances(const std::string& plugin_id = "") = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `plugin_id` | Optional canonical plugin identifier. |

## Returns

Matching live module summaries.
