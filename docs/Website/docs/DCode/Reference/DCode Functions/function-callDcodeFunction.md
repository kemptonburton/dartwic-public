---
title: "callDcodeFunction"
summary: "Call a plugin-provided native DCode function."
---

## Syntax

```dcode
callDcodeFunction(function_name, payload)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Example

```lua
callDcodeFunction(function_name, payload)
```
