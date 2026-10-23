---
title: assert
summary: Raise an error if a condition is false.
created: 2026-08-04T17:39
updated: 2026-10-22T17:41
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
