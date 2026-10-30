---
title: abort
summary: Report an ARGUS abort and return a numeric host result, normally 1. Reporting does not automatically stop tasks or command hardware; configure the required control reaction separately.
created: 2026-08-04T17:38
updated: 2026-10-28T19:18
---

## Syntax

```dcode
abort(title, description, channels?, resolution?, auto_acknowledge?, firing_timeout_seconds?, system?, subsystem?)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Rules

- Arguments are positional. Firing timeout defaults to five seconds after the latest detection; zero requires stop_event_firing. Repeated reports aggregate detections within one firing occurrence.

## Example

```dcode
abort(title, description, [], "", 0, 0)
```

## Inputs

- `title` (string): ARGUS title
- `description` (string): ARGUS body text
- `channels` (array<string|array<string>>): ARGUS graph specification. One graph: ["|temperature|@1", ">100@1"]. Multiple stacked graphs: [["|temperature|@1"], ["|pressure|@1", "=50@2"]]. Commas add series, nested arrays add graphs, and @1 through @5 selects a series or overlay Y axis. Series may be |channel|, >value, >=value, <value, <=value, or =value.
- `resolution` (string): Recommended operator action
- `auto_acknowledge` (integer seconds): Seconds before visual acknowledgement; zero disables it
- `firing_timeout_seconds` (number seconds): Inactivity timeout in seconds; defaults to 5. Zero requires explicit stop.
- `system` (string): ARGUS system grouping
- `subsystem` (string): ARGUS subsystem grouping

## Outputs

- `result` (number): Numeric host result, normally 1; this is not an event ID
