---
title: local
summary: Optional declaration spelling. Bare assignment declares a name in the current file, runtime or function scope. File-prelude values are shared across that file's runtime blocks; use global inside a block or function to access outer data.
created: 2026-08-04T17:39
updated: 2026-10-22T17:41
---

## Syntax

```dcode
local <name> [= <value>]
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Optional spelling for a variable declaration; both backends use DCode values and require initialization before reading.

## Example

```dcode
local name = value
```
