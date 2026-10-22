---
title: promptNumerical
summary: Display a numerical ARGUS prompt and return its response. In a timeline bucket, suspends only that bucket until the response arrives; the mission clock and other due buckets continue. Other execution contexts wait on their invoking thread.
created: 2026-08-04T17:38
updated: 2026-10-19T17:54
---

## Syntax

```dcode
promptNumerical(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Example

```lua
promptNumerical("title", "description", [], "", 0, 0)
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

- `response` (number): Numeric operator response
