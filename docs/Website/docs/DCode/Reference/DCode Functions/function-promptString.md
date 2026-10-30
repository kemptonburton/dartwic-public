---
title: promptString
summary: Display a free-text ARGUS prompt. In a timeline bucket, suspends only that bucket until the response arrives; the mission clock and other due buckets continue. Other execution contexts wait on their invoking thread.
created: 2026-08-04T17:38
updated: 2026-10-28T19:18
---

## Syntax

```dcode
promptString(title, description, channels?, resolution?, auto_acknowledge?, system?, subsystem?)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Rules

- Arguments are positional. Firing has no automatic timeout; answering the prompt or releasing the hold ends its firing and wait.

## Example

```dcode
promptString("title", "description", [], "", 0)
```

## Inputs

- `title` (string): ARGUS title
- `description` (string): ARGUS body text
- `channels` (array<string|array<string>>): ARGUS graph specification. One graph: ["|temperature|@1", ">100@1"]. Multiple stacked graphs: [["|temperature|@1"], ["|pressure|@1", "=50@2"]]. Commas add series, nested arrays add graphs, and @1 through @5 selects a series or overlay Y axis. Series may be |channel|, >value, >=value, <value, <=value, or =value.
- `resolution` (string): Recommended operator action
- `auto_acknowledge` (integer seconds): Seconds before visual acknowledgement; zero disables it
- `system` (string): ARGUS system grouping
- `subsystem` (string): ARGUS subsystem grouping

## Outputs

- `response` (string): Operator text response
