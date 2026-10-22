---
title: loop
summary: Define a lightweight repeated automation loop in DCode.
created: 2026-08-04T17:38
updated: 2026-10-03T01:16
---

## Syntax

```dcode
loop <name> <frequency_hz> [disable_warnings]:
```

## Available in

- File scope

## Native C++

Compiled as a CAESAR-managed task callback. Native loops appear in task runtime metadata; the Lua backend uses the threaded-loop runtime.

## Lifecycle

Activation starts a named repeated body at the requested frequency under a CAESAR loop controller. Optional disable_warnings disables missed-release and completion-deadline warnings for intentional blocking automation; callback failures still report. Frequency, execution wall time including waits, and skipped-cycle counters remain measured. Omitting it retains strict timing warnings.

## Persistence

Values stored in state remain available between iterations while the loop is loaded. Initialize a state field before reading it; `once when true:` can do this on the first iteration.

## Reload behavior

DARTWIC tracks changes to the block when loading the loop.

## Runtime sections

- `loop body`

## Generated channels

- `<name>_target_frequency`
- `<name>_actual_frequency`
- `<name>_execution_time`
- `<name>_missed_cycles`
- `<name>_failed_cycles`

## Example

```lua
loop name 10:
    current = |channel|
```
