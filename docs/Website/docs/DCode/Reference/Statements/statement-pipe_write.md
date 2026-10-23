---
title: pipe write
summary: "Write a RAPID channel value or typed metadata field without taking automation authority. In Lua mode, value_options accepts an array of {value: number, label: text} objects with finite, unique values and nonempty labels."
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
---

## Syntax

```dcode
|channel|[:field] = <expression>
```

## Available in

- Executable DCode bodies
- File scope

## Native C++

Numeric value writes support static and interpolated channel names. Static output targets are declared as fixed channels during native activation; interpolated targets use runtime name lookup. Pipe metadata assignments are unavailable; use a supported typed host API for metadata.

## Example

```dcode
|channel|:field = value
```
