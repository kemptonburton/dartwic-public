---
title: "on_event"
summary: "Run synchronously when the event enters or leaves the active ARGUS board, including silence. Static pipe reads also register dependencies and can rerun the reaction without a board transition. The generated state passes through unchanged; do not return a replacement value."
---

## Syntax

```dcode
on_event:
```

## Available in

- An event declaration

## Example

```dcode
on_event:
    |indicator_channel| = value
```
