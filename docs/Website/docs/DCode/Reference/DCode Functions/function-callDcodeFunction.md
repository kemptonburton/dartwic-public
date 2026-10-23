---
title: callDcodeFunction
summary: Call a plugin-provided native DCode function.
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
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

```dcode
callDcodeFunction(function_name, payload)
```
