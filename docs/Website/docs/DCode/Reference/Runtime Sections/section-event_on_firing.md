---
title: on_firing
summary: Run synchronously when the firing channel changes between 0 and 1. Static pipe reads also register dependencies and can rerun the reaction without a firing transition. The generated state passes through unchanged; do not return a replacement value.
created: 2026-09-04T17:13
updated: 2026-10-22T17:41
---

## Syntax

```dcode
on_firing:
```

## Available in

- An event declaration

## Example

```dcode
on_firing:
    |automation_channel| = value
```
