---
title: "global"
summary: "Declare a file-global or other outer data name before reading or writing it from a runtime block or function. File globals share one store across blocks in the same file and reset on activation. Functions and imports can be called without global."
---

## Syntax

```dcode
global <name>[, <name>...]
```

## Available in

- Executable DCode bodies
- Runtime block scope

## Example

```lua
global name
```
