---
title: "clock_start"
summary: "Initial mission time. Required unless clock_t0 is supplied; the two fields are mutually exclusive."
---

## Syntax

```dcode
clock_start: <T-/T+ time>
```

## Available in

- A mission-time task_timeline declaration

## Example

```dcode
clock_start: T-30s
```
