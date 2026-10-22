---
title: "for each"
summary: "Iterate array values or object keys in order. An if or for block does not create a new DCode variable scope."
---

## Syntax

```dcode
for <name> in <array-or-object>:
```

## Available in

- Executable DCode bodies

## Lua transformation

for _, <name> in __dc_iter(<collection>) do ... end

## Example

```dcode
for item in items:
    -- body
```
