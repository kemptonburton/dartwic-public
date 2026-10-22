---
title: "trigger"
summary: "Create the writable <event_key>_trigger pulse channel. An optional dependency-driven body returns 1 while the event should be firing; writing 1 directly still triggers once and automatically resets to 0."
---

## Syntax

```dcode
trigger:
```

## Available in

- An event declaration

## Example

```lua
trigger:
    -- return 1 when the event should fire
```
