---
title: "wait"
summary: "Pause for finite nonnegative seconds; a task hold pauses elapsed time. In a timeline bucket, only that bucket waits while mission time and other due buckets continue. A clock hold freezes mission time but lets the wait progress."
---

## Syntax

```dcode
wait(seconds)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Blocks the callback thread and checks cancellation; sequence holds pause active duration accounting.

## Example

```dcode
wait(1.0)
```
