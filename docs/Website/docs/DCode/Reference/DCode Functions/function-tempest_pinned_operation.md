---
title: "tempest_pinned_operation"
summary: "Run a saved pinned operation on the current engine or a connected remote TEMPEST node. Use its stable ID or an unambiguous label; optional object values override saved arguments. The editor suggests nodes and their pins."
---

## Syntax

```dcode
tempest_pinned_operation(node, preset, overrides?)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ resolves the shared pin and invokes its operation. It blocks this callback; keep it outside fixed-rate control callbacks.

## Example

```lua
tempest_pinned_operation("node", "preset", {})
```
