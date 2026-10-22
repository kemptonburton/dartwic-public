---
title: arrays and objects
summary: Arrays have zero-based indexes; objects have string keys. Nest either form, preserve null, and pass values to plugin functions in either backend. Native C++ permits replacement of existing items and fields but keeps array lengths and object keys fixed; push, pop, and adding object keys require Lua.
created: 2026-08-04T17:38
updated: 2026-10-22T17:40
---

## Syntax

```dcode
[value, ...] or {key: value, ...}
```

## Available in

- File scope
- Executable DCode bodies
