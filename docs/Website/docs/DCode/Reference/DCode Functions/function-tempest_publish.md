---
title: "tempest_publish"
summary: "Publish custom telemetry to TEMPEST clients and peers."
---

## Syntax

```dcode
tempest_publish(topic, payload)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ invokes the engine TEMPEST host API; review its cost in a control callback.

## Example

```lua
tempest_publish(topic, payload)
```
