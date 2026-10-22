---
title: "for"
summary: "Use a Lua for-clause with DCode colon-and-indentation syntax."
---

## Syntax

```dcode
for <Lua for-clause>:
```

## Available in

- Executable DCode bodies

## Lua transformation

for <clause> do ... end

## Example

```dcode
for index = 1, 10:
    -- body
```
