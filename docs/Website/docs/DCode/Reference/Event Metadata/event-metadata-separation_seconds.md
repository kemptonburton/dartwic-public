---
title: separation_seconds
summary: Optional finite nonnegative ARGUS quiet interval; defaults to zero.
created: 2026-10-20T18:59
updated: 2026-10-22T17:41
---

Optional finite nonnegative ARGUS quiet interval; defaults to zero. Zero disables ARGUS automatic expiry. Condition deassertion or the end of a five-second pulse explicitly stops the occurrence. A positive interval does not configure the generated pulse window and can expire the ARGUS occurrence while the maintained firing signal stays asserted; use zero for maintained conditions.

## Syntax

```dcode
separation_seconds: <seconds>
```

## Available in

- An event declaration

## Example

```dcode
separation_seconds: 0
```
