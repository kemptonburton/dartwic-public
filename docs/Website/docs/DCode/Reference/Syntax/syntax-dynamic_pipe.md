---
title: "dynamic channel reference"
summary: "Interpolate DCode expressions into a channel name. Dynamic references use name-based lookup in both backends."
---

## Syntax

```dcode
|{expression}_channel|[:field]
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Interpolated names compile through the name-based RAPID host path. Static value pipes retain prepared bindings; dynamic names do not use the fixed-binding fast path.
