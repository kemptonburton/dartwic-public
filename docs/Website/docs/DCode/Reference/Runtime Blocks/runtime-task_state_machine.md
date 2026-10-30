---
title: task_state_machine
summary: Define a named-state CAESAR task in DCode.
created: 2026-08-04T17:38
updated: 2026-10-27T16:09
---

## Syntax

```dcode
task_state_machine <name> [frequency_hz] [priority] [disable_warnings]:
```

## Available in

- File scope

## Lifecycle

Activation declares states and task channels; the current handler runs while active and transitions only when script code requests one. Optional disable_warnings suppresses timing warnings while keeping measurements, skipped-cycle counts and callback errors.

## Persistence

Runtime variables and current state persist between handlers within a run. Each task start recreates working state; initialize data before reading it. A state once block runs again on each state entry.

## Reload behavior

DARTWIC tracks changes to the block and its template dependencies when loading the task.

## Rules

- Frequency is positive Hz and defaults to 10. Priority is background, normal (default), high, or critical; supply a frequency before priority. The optional disable_warnings flag comes last.

## Runtime sections

- `start`
- `state`
- `missed`
- `end`

## Generated channels

- `<name>_running`
- `<name>_target_frequency`
- `<name>_actual_frequency`
- `<name>_execution_time`
- `<name>_missed_cycles`
- `<name>_hold`
- `<name>_current_state`
- `<name>_target_state`
- `<name>_failed_cycles`

## Example

```dcode
task_state_machine task_name:
    states:
        idle
        running

    state idle:
        if target_state == states.running:
            transition running
```
