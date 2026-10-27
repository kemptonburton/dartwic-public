---
title: set channel
summary: Acquire or retain observe-only publishing, optionally writing a value. Without an eligible local owner, or for a remote channel, a supplied value is an ordinary upsert and an omitted value does nothing. Local transition/write rejection changes neither authority nor value.
created: 2026-08-04T17:38
updated: 2026-10-26T18:30
---

## Syntax

```dcode
set |channel| [= <value>]
```

## Available in

- File scope
- Executable DCode bodies

## Example

```dcode
set |channel| = value
```
