---
title: "SDK_API::registerModuleType"
summary: "Registers a plugin-local module type and returns its qualified identifier."
---

## Declaration

```cpp
virtual std::string registerModuleType(ModuleTypeDefinition definition) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `definition` | Module type metadata and file paths. |

## Returns

The plugin-qualified module type identifier.
