---
title: pipe write
summary: "Write a RAPID channel value or typed metadata field without taking automation authority. In Lua mode, value_options accepts an array of {value: number, label: text} objects with finite, unique values and nonempty labels."
created: 2026-08-04T17:38
updated: 2026-10-19T17:13
---

## Syntax

```dcode
|channel|[:field] = <expression>
```

## Available in

- Executable DCode bodies
- File scope

## Native C++

Only numeric value writes to static |channel| targets are supported; metadata assignments are unavailable. Direct output targets are declared as fixed channels during native activation.

## Example

```lua
|channel|:field = value
```
