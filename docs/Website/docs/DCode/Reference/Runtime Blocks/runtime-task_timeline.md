---
title: task_timeline
summary: Schedule cooperative DCode sequence buckets against a signed T-/T+ mission clock. Buckets share one tick thread; ordinary blocking code stalls the entire timeline.
created: 2026-10-04T18:31
updated: 2026-10-22T17:41
---

## Syntax

```dcode
task_timeline <name> [frequency_hz] [priority] [disable_warnings]:
```

## Available in

- File scope

## Native C++

Unavailable in Native C++; select Lua for a file containing task_timeline.

## Lifecycle

Ticks at a configurable frequency (default 10 Hz). Inside a bucket, wait, wait_until, operator prompts, and waiting DCode callback calls suspend only that bucket; mission time and other due buckets continue. Arbitrary blocking host calls still stall the tick. A tick that exceeds its configured period excludes that tick execution interval from subsequent mission time and shifts effective T0, rather than catching up through later buckets. Timing warnings remain enabled by default. A bucket's scheduled clock hold freezes mission time and admission of later buckets while active buckets keep executing. Completion releases its scheduled hold unless an operator also holds the clock. The task `_hold` pauses execution and managed waits. Both holds retain timeline authority until explicit `free` or completed stop. The timeline stops once all buckets complete. An interrupted running timeline enters recovery and marks in-progress buckets uncertain on activation. Optional `disable_warnings` suppresses timing warnings while keeping measurements and callback errors.

## Rules

- The timeline requires one `clock:` section containing exactly one of `start: T-1m` or `t0: 2026-10-14T18:00:00Z`, plus at least one `at T-1m (optional_label):` bucket.
- Signed T times accept a number followed by `ms`, `s`, `m`, or `h` (`T-1m`, `T+30s`) or an `HH:MM:SS[.fraction]` clock form (`T+00:01:30`). Bare `1m`, `T0`, and `at: T-1m` are not bucket headers.
- Each bucket may have one `hold_at:` field at the same indentation as `execute:`. Use a signed T time at or after the bucket start, or `next_bucket`. The latter uses the next scheduled bucket after time ordering and requires a following bucket.
- A bucket can contain direct statements. If it declares any bucket-level `hold:`, `resume:`, `stop:`, or `abort:` section, it also requires `execute:` and all ordinary statements go inside that section.
- Timeline-level `hold:`, `resume:`, `stop:`, and `abort:` handlers are siblings of the `at` buckets. The same names inside a bucket are bucket-level handlers. Each optional handler is allowed once at its level.

## Runtime sections

- `clock`
- `at`
- `hold_at`
- `execute`
- `hold`
- `resume`
- `stop`
- `abort`

## Generated channels

- `<name>_running`
- `<name>_hold`
- `<name>_clock_hold`
- `<name>_mission_time`
- `<name>_effective_t0`
- `<name>_clock_running`
- `<name>_aborted`
- `<name>_current_line`
- `<name>_target_frequency`
- `<name>_actual_frequency`
- `<name>_execution_time`
- `<name>_missed_cycles`
- `<name>_failed_cycles`

## Example

```dcode
task_timeline timeline_name:
    clock:
        start: T-30m

    at T-20m (operation):
        hold_at: T-10m
        execute:
            command |task_running| = 1
```

## Inputs

- `name` (required identifier): The timeline task name.
- `frequency_hz` (optional positive number): Timeline scheduler frequency in Hz; defaults to 10.
- `priority` (optional enum): background, normal (default), high, or critical. Supply frequency_hz first when setting priority.
- `disable_warnings` (optional flag): Suppress timing warnings while keeping measurements and callback errors.
- `clock.start` (mission time): Choose the initial signed T time, such as T-1m or T+00:00:05. Use this or clock.t0, never both.
- `clock.t0` (ISO-8601 timestamp): Alternative to clock.start; include Z or an explicit UTC offset, for example 2026-10-14T18:00:00Z.
- `at <time> [(label)]` (bucket header): Use at T-1m (tank_fill):, at T+0s (ignition):, or omit the label. Labels, when present, must be unique.
- `hold_at` (optional bucket field): Use one signed T time at or after this bucket's start, or next_bucket. The latter uses the next bucket in scheduled order and requires a following bucket.
