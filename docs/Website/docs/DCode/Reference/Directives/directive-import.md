---
title: import
summary: Import a helper .dcode module in either backend, or a .lua helper in Lua mode. Relative paths resolve from the importing file.
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
---

## Syntax

```dcode
import "<module>"
```

## Available in

- File scope
- Runtime block scope

## Native C++

Compiles helper-only .dcode modules, including nested imports, into the native artifact. Raw .lua modules require the Lua backend. Relative paths resolve from the importing file.

## Example

```dcode
import "./helpers/math"
```
