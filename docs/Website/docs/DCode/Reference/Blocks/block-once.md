---
title: once
summary: Run this block on its first visit during the containing runtime-section execution. Nested ordinary blocks do not reset it. Not allowed in functions, callbacks, calculations or events.
created: 2026-08-04T17:38
updated: 2026-10-27T16:09
---

## Syntax

```dcode
once:
```

## Available in

- Task, state, loop, sequence and timeline runtime sections

## Example

```dcode
once:
    -- one-time work
```
