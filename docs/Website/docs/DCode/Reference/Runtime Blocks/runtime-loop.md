---
title: loop
summary: Define a lightweight repeated automation loop in DCode.
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
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

Ordinary runtime variables and state fields persist between iterations until reactivation. Initialize before reading; `once when true:` can initialize the first iteration. A loop has no start section.

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

```dcode
loop name 10:
    current = |channel|
```
