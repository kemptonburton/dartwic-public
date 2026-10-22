---
title: "tempest_operation"
summary: "Invoke a registered TEMPEST operation on the current engine or a connected remote node and return its result."
---

Invoke a registered TEMPEST operation on the current engine or a connected remote node and return its result. The editor suggests nodes and operations; when field metadata is available, selecting an operation fills an empty payload and selects its first value. Remote calls are never automatically retried.

## Syntax

```dcode
tempest_operation(node, operation, payload?)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ invokes the engine TEMPEST dispatcher. Local handlers may block, and remote calls add network latency, so keep this outside fixed-rate control callbacks.

## Example

```lua
tempest_operation("node", "operation", {})
```
