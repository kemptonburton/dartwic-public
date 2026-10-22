---
title: global
summary: Declare a file-global or other outer data name before reading or writing it from a runtime block or function. File globals share one store across blocks in the same file and reset on activation. Functions and imports can be called without global.
created: 2026-10-04T18:31
updated: 2026-10-22T17:41
---

## Syntax

```dcode
global <name>[, <name>...]
```

## Available in

- Executable DCode bodies
- Runtime block scope

## Example

```dcode
global name
```
