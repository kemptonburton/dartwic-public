---
title: for
summary: Use a Lua for-clause with DCode colon-and-indentation syntax.
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
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
