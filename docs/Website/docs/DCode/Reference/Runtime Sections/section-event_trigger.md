---
title: trigger
summary: Create the writable <event_key>_trigger pulse input.
created: 2026-09-04T17:13
updated: 2026-10-22T17:41
---

Create the writable <event_key>_trigger pulse input. A populated body evaluates at activation and on dependency value writes: exact numeric 1 maintains firing; zero, another result, no return, or an execution error clears the condition. The input resets to 0 after an assertion; observe <event_key>_firing for the maintained state. Direct writes of 1 fire a five-second pulse; direct writes of 0 do not stop firing.

## Syntax

```dcode
trigger:
```

## Available in

- An event declaration

## Example

```dcode
trigger:
    -- return 1 when the event should fire
```
