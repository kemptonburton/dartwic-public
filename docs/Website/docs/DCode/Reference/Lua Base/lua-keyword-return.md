---
title: "return"
summary: "Return values from a function, handler, or calculation."
---

## Syntax

```dcode
return [values]
```

## Available in

- Executable DCode bodies

## Native C++

Functions return a DCode value. Calculations publish a returned number; null suppresses an update. Task callbacks ignore a returned value.

## Example

```lua
return value
```
