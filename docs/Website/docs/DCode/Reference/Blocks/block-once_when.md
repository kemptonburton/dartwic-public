---
title: once when
summary: Run once after the condition has stayed true across evaluations for time seconds.
created: 2026-08-04T17:38
updated: 2026-10-26T01:01
---

Run once after the condition has stayed true across evaluations for time seconds. Nonblocking in tasks, loops and channel calculations; false resets pending timing but never rearms a fired block. Legacy once when condition: and a positional duration are supported. Time must be a finite nonnegative number; omitted or zero is immediate. Monotonic elapsed gaps, holds and skipped branches count. Calculations evaluate only on target/dependency writes. Task starts reset state; loops/calculations retain it until replacement. Include validity/freshness checks explicitly.

## Syntax

```dcode
once when(condition, time=0):
```

## Available in

- Executable DCode bodies

## Native C++

Uses fixed retained timer state; repeated qualification does not sleep, schedule work or allocate.

## Example

```dcode
once when(condition, time=0):
    -- one-time work
```
