---
title: return
summary: Return values from a function, handler, or calculation.
created: 2026-08-04T17:39
updated: 2026-10-22T18:02
---

## Syntax

```dcode
return [values]
```

## Available in

- Executable DCode bodies

## Native C++

Functions return a DCode value. Calculations supply a numeric result; null supplies no result, skipping dependency-driven target publication without canceling a direct write. Task callbacks ignore a returned value.

## Example

```dcode
return value
```
