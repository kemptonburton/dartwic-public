---
title: SDK_API::registerOperation
summary: Registers a plugin extension operation; it does not become an official DARTWIC operation.
created: 2026-08-04T17:38
updated: 2026-09-26T14:50
---

## Declaration

```cpp
virtual std::string registerOperation(OperationDefinition definition) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `definition` | Local ID, display metadata, argument fields, and handler. |

## Returns

The plugin-qualified operation identifier.
