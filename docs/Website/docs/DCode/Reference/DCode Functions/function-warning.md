---
title: warning
summary: Report an ARGUS warning and return a numeric host result, normally 1. Reporting does not wait for acknowledgement or resolution.
created: 2026-08-04T17:39
updated: 2026-10-22T17:41
---

## Syntax

```dcode
warning(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Rules

- Arguments are positional. To supply separation_seconds with default graph, resolution, and acknowledgement settings, pass [], "", 0 before the interval. A positive interval ends the ARGUS occurrence after quiet time; zero disables automatic expiry. Expiry does not answer a prompt or release a hold.

## Example

```dcode
warning(title, description, [], "", 0, 0)
```

## Inputs

- `title` (string): ARGUS title
- `description` (string): ARGUS body text
- `channels` (array<string|array<string>>): ARGUS graph specification. One graph: ["|temperature|@1", ">100@1"]. Multiple stacked graphs: [["|temperature|@1"], ["|pressure|@1", "=50@2"]]. Commas add series, nested arrays add graphs, and @1 through @5 selects a series or overlay Y axis. Series may be |channel|, >value, >=value, <value, <=value, or =value.
- `resolution` (string): Recommended operator action
- `auto_acknowledge` (integer seconds): Seconds before visual acknowledgement; zero disables it
- `separation_seconds` (number seconds): Finite nonnegative quiet interval; zero requires explicit stop
- `system` (string): ARGUS system grouping
- `subsystem` (string): ARGUS subsystem grouping

## Outputs

- `result` (number): Numeric host result, normally 1; this is not an event ID
