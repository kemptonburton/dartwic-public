---
title: task_sequence
summary: Define a sequential CAESAR task in DCode.
created: 2026-08-04T17:38
updated: 2026-10-22T17:46
---

## Syntax

```dcode
task_sequence <name> [frequency_hz] [priority] [disable_warnings]:
```

## Available in

- File scope

## Lifecycle

Activation creates the task; each start executes the sequence body once in order while publishing its current source line. Waits pace the procedure; an accepted header frequency does not pace individual statements or create frequency channels. Optional disable_warnings suppresses timing warnings while keeping callback errors and internal measurements.

## Persistence

Ordinary runtime variables and state fields persist across the sequence's lifecycle sections within a run. Each task start recreates working state; initialize it before reading, usually in start.

## Reload behavior

DARTWIC tracks changes to the block and its template dependencies when loading the task.

## Runtime sections

- `start`
- `sequence body`
- `missed`
- `end`

## Generated channels

- `<name>_running`
- `<name>_hold`
- `<name>_current_line`
- `<name>_failed_cycles`

## Example

```dcode
task_sequence task_name:
    wait(1.0)
```
