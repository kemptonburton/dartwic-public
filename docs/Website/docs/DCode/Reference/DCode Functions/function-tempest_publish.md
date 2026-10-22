---
title: tempest_publish
summary: Publish custom telemetry to TEMPEST clients and peers.
created: 2026-10-04T18:31
updated: 2026-10-22T17:41
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

```dcode
tempest_publish(topic, payload)
```
