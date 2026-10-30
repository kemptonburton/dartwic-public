---
title: trigger
summary: Create the writable <event_key>_trigger pulse input.
created: 2026-10-27T16:09
updated: 2026-10-29T01:35
---

Create the writable <event_key>_trigger pulse input. A populated body evaluates at activation and on dependency value writes: each exact numeric 1 reports a detection; zero, another result, no return, or an execution error clears the condition. The input resets to 0 after each assertion, including calculated assertions while the condition stays true. Observe <event_key>_firing for the maintained state. Direct writes of 1 use the declaration firing_timeout_seconds; resetting or directly writing 0 does not stop firing. There is no separate five-second pulse.

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
