---
title: "stop_event_firing"
summary: "Synchronously end a locally owned firing and its declared on_firing reaction. Preserve board status and history. Does not answer a prompt or release a hold. Return true if firing ended, false if absent or already stopped."
---

## Syntax

```dcode
stop_event_firing(title, system?, subsystem?)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Uses the same host stop operation as Lua. State changes are synchronous; recording and telemetry are asynchronous.

## Example

```dcode
stop_event_firing("title")
```

## Inputs

- `title` (string): Event title.
- `system` (string): Defaults to SOFTWARE.
- `subsystem` (string): Defaults to DCODE.

## Outputs

- `stopped` (boolean): Whether a firing ended.
