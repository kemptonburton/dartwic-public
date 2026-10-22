---
title: task_periodic
summary: Define a periodic CAESAR task in DCode.
created: 2026-08-04T17:38
updated: 2026-10-22T17:46
---

## Syntax

```dcode
task_periodic <name> [frequency_hz] [priority] [disable_warnings]:
```

## Available in

- File scope

## Native C++

Compiles supported task logic to machine code. Fixed-channel reads and accepted writes occur at their executing lines. Prepared numeric operations and supported fixed collections can reuse storage; inline calculations and plugin code have their own costs. Neither the backend nor task priority guarantees a deadline.

## Lifecycle

Activation creates the task and its channels; start runs once, task repeats while running, and end runs when stopped. Optional disable_warnings suppresses timing warnings while keeping measurements, skipped-cycle counts and callback errors.

## Persistence

Ordinary runtime variables and state fields persist across lifecycle sections and iterations within a run. Each task start recreates working state; initialize it before reading, usually in start. File globals require an explicit global declaration and instead reset on file activation.

## Reload behavior

DARTWIC tracks changes to the block and its template dependencies when loading the task.

## Rules

- Frequency is positive Hz and defaults to 10. Priority is background, normal (default), high, or critical; supply a frequency before priority. The optional disable_warnings flag comes last.

## Runtime sections

- `start`
- `task`
- `missed`
- `end`

## Generated channels

- `<name>_running`
- `<name>_target_frequency`
- `<name>_actual_frequency`
- `<name>_execution_time`
- `<name>_missed_cycles`
- `<name>_hold`
- `<name>_failed_cycles`

## Example

```dcode
task_periodic task_name 100 background:
    start:
        -- setup

    task elapsed_seconds:
        local current = |channel|

    end:
        -- cleanup
```
