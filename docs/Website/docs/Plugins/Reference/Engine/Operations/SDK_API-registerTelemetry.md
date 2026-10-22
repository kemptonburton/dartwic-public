---
title: "SDK_API::registerTelemetry"
summary: "Registers a plugin-local telemetry topic for the runtime catalog. The plugin namespace supplies the qualified topic and operator category."
---

## Declaration

```cpp
virtual std::string registerTelemetry(TelemetryDefinition definition) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `definition` | Local topic ID and operator-facing metadata. |

## Returns

The plugin-qualified topic.
