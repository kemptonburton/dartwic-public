---
title: task_state_machine
summary: Define a named-state CAESAR task in DCode.
created: 2026-08-04T17:38
updated: 2026-10-03T00:15
---

## Syntax

```dcode
task_state_machine <name> [disable_warnings]:
```

## Available in

- File scope

## Lifecycle

Activation declares states and task channels; the current handler runs while active and transitions only when script code requests one. Optional disable_warnings suppresses timing warnings while keeping measurements, skipped-cycle counts and callback errors.

## Persistence

The state table and current state remain available between handler calls while the task is loaded.

## Reload behavior

DARTWIC tracks changes to the block and its template dependencies when loading the task.

## Runtime sections

- `states`
- `start`
- `state`
- `missed`
- `end`

## Generated channels

- `<name>_running`
- `<name>_target_frequency`
- `<name>_actual_frequency`
- `<name>_hold`
- `<name>_current_state`
- `<name>_target_state`
- `<name>_failed_cycles`

## Example

```lua
task_state_machine task_name:
    states:
        idle
        running

    state idle:
        if target_state == states.running:
            transition running
```
