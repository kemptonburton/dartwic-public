---
title: "task_periodic"
summary: "Define a periodic CAESAR task in DCode."
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

Values stored in state remain available between handler calls while the task is loaded.

## Reload behavior

DARTWIC tracks changes to the block and its template dependencies when loading the task.

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

```lua
task_periodic task_name 100 ${3|background,normal,high,critical|}:
    start:
        -- setup

    task elapsed_seconds:
        local current = |channel|

    end:
        -- cleanup
```
