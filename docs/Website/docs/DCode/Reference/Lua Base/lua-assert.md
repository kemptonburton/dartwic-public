---
title: "assert"
summary: "Raise an error if a condition is false."
---

## Syntax

```dcode
assert(condition, message)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Supported as an assert(condition) statement. An optional message and Lua-style returned values are unavailable; failure fails the native callback.

## Example

```dcode
assert(condition, message)
```
