---
title: automatic override
summary: Temporarily supersede automatic control until explicitly freed.
created: 2026-10-04T18:31
updated: 2026-10-22T17:41
---

## Syntax

```dcode
override |channel| = <value>
```

## Available in

- CAESAR task and loop bodies
- Channel calculations
- event reaction
- Shared helper functions

## Native C++

Supported for numeric channel values. An automatic override remains active until the same controller explicitly uses `free |channel|`; it cannot displace an operator manual override.

## Example

```dcode
override |channel| = value
```
