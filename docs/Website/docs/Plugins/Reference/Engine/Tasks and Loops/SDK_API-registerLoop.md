---
title: "SDK_API::registerLoop"
summary: "Registers a CAESAR-controlled plugin loop and returns its qualified identifier."
---

## Declaration

```cpp
virtual std::string registerLoop(std::string local_id, std::string name, PluginLoopDefinition definition) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `local_id` | Identifier unique within the plugin. |
| `name` | Operator-facing loop name. |
| `definition` | Loop lifecycle and target frequency. |

## Returns

The plugin-qualified loop identifier.
