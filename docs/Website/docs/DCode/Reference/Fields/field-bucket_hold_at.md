---
title: "hold_at"
summary: "Optional bucket clock checkpoint, at or after its start. next_bucket requires a later bucket."
---

## Syntax

```dcode
hold_at: <T-/T+ time or next_bucket>
```

## Available in

- A timeline at bucket

## Example

```dcode
hold_at: next_bucket
```
