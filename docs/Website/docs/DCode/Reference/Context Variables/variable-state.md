---
title: state
summary: Persistent runtime storage, also available through ordinary runtime variables without a state prefix. Initialize before reading; arrays and objects can be stored here. Callbacks have ordinary per-call function scope rather than a persistent state store.
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
---

## Syntax

```dcode
state.<name>
```

## Available in

- Runtime block bodies
- Shared helper functions

## Native C++

Native state fields use the same DCode value types. Initialize a field before reading it.

## Example

```dcode
state.name
```
