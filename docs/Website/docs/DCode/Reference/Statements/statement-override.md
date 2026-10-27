---
title: automatic override
summary: Acquire or retain the current automatic override, optionally writing a value. Without an eligible local owner, or for a remote channel, a supplied value is an ordinary upsert and an omitted value does nothing. Local transition/write rejection changes neither authority nor value.
created: 2026-10-04T18:31
updated: 2026-10-26T18:30
---

## Syntax

```dcode
override |channel| [= <value>]
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Supported for numeric channel values. An automatic override remains active until the same controller explicitly uses `free |channel|`; it cannot displace an operator manual override.

## Example

```dcode
override |channel| = value
```
