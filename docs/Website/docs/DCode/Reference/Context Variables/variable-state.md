---
title: "state"
summary: "Per-runtime storage for values that survive handler calls. Initialize before reading; arrays and objects can be stored here."
---

## Syntax

```dcode
state.<name>
```

## Available in

- Runtime block bodies
- Shared helper functions

## Native C++

Native state fields use the same DCode value types. Initialize a field before reading it.

## Example

```lua
state.name
```
