---
title: hold
summary: "Display an ARGUS hold and block the invoking thread until release. This is not a cooperative timeline wait: calling it in a bucket can stall the entire timeline. Quiet expiry and acknowledgement do not release it. Returns a numeric host result, normally 1 after release, rather than an event ID."
created: 2026-08-04T17:38
updated: 2026-10-28T19:18
---

## Syntax

```dcode
hold(title, description, channels?, resolution?, auto_acknowledge?, system?, subsystem?)
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
hold(title, description, [], "", 0)
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

- `result` (number): Numeric host result, normally 1; this is not an event ID
