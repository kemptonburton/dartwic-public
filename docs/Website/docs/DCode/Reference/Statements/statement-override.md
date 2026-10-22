---
title: "automatic override"
summary: "Temporarily supersede automatic control until explicitly freed."
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
