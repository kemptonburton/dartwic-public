---
title: when
summary: Run on every evaluation after the condition has stayed true across evaluations for time seconds.
created: 2026-08-04T17:38
updated: 2026-10-26T01:01
---

Run on every evaluation after the condition has stayed true across evaluations for time seconds. Nonblocking in tasks, loops and channel calculations; false resets the timer. Legacy when condition: and a positional duration are supported. Time must be a finite nonnegative number; omitted or zero is immediate. Duration expressions are reevaluated without restarting the true interval. Monotonic elapsed gaps, holds and skipped branches count. Calculations evaluate only on target/dependency writes. Include validity/freshness checks explicitly.

## Syntax

```dcode
when(condition, time=0):
```

## Available in

- Executable DCode bodies

## Native C++

Uses fixed retained timer state; repeated qualification does not sleep, schedule work or allocate.

## Example

```dcode
when(condition, time=0):
    -- body
```
