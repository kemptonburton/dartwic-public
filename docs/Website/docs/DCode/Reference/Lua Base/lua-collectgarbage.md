---
title: "collectgarbage"
summary: "Control the Lua garbage collector."
---

## Syntax

```dcode
collectgarbage(option)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Lua only. This feature has no Native C++ code-generation binding.

## Example

```dcode
collectgarbage("collect")
```
