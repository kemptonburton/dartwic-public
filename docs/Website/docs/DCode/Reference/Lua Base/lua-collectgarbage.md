---
title: collectgarbage
summary: Control the Lua garbage collector.
created: 2026-08-04T17:39
updated: 2026-10-22T17:41
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
