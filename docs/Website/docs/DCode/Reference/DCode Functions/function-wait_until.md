---
title: wait_until
summary: Wait for continuous truth for time seconds. A positive timeout raises an execution error; zero disables expiry. In a timeline bucket, only that bucket waits; the mission clock and other due buckets continue. A task hold pauses duration and timeout accounting; a clock hold does not.
created: 2026-10-10T20:46
updated: 2026-10-19T17:54
---

## Syntax

```dcode
wait_until(condition, time=0, timeout=0)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Reevaluates the condition live; continuous truth resets on false, and holds pause time and timeout accounting.

## Example

```lua
wait_until(|ready| == 1, 0, 0)
```
