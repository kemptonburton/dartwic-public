---
title: "task_sequence"
summary: "Define a sequential CAESAR task in DCode."
---

## Syntax

```dcode
task_sequence <name> [disable_warnings]:
```

## Available in

- File scope

## Lifecycle

Activation creates the task; each run executes the sequence in order while publishing its current source line. Optional disable_warnings suppresses timing warnings while keeping measurements, skipped-cycle counts and callback errors.

## Persistence

Values stored in state remain available throughout sequence execution while the task is loaded.

## Reload behavior

DARTWIC tracks changes to the block and its template dependencies when loading the task.

## Runtime sections

- `start`
- `sequence body`
- `missed`
- `end`

## Generated channels

- `<name>_running`
- `<name>_target_frequency`
- `<name>_actual_frequency`
- `<name>_hold`
- `<name>_current_line`
- `<name>_failed_cycles`

## Example

```lua
task_sequence task_name:
    wait(1.0)
```
