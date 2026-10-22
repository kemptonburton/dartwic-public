---
title: "SDK_API::registerTaskType"
summary: "Registers a plugin-local task type and returns its qualified identifier."
---

## Declaration

```cpp
virtual std::string registerTaskType(std::string local_id, std::string name, TaskTypeDefinition definition) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `local_id` | Identifier unique within the plugin. |
| `name` | Operator-facing task type name. |
| `definition` | Task metadata and lifecycle callbacks. |

## Returns

The plugin-qualified task type identifier.
