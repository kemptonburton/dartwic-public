---
title: when
summary: Run on every visit after the condition qualifies for a finite positive time in seconds.
created: 2026-08-04T17:38
updated: 2026-10-27T16:09
---

Run on every visit after the condition qualifies for a finite positive time in seconds. False resets timing; changing time preserves the true interval. Monotonic gaps, holds and skipped branches count. Nonblocking; no checks are scheduled. Use if for immediate conditions and nest once for one-time runtime-section work.

## Syntax

```dcode
when(condition, time=seconds):
```

## Available in

- Executable DCode bodies

## Native C++

Uses fixed retained timer state; repeated qualification does not sleep, schedule work or allocate.

## Example

```dcode
when(condition, time=0.5):
    -- body
```
