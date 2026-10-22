---
title: channels
summary: Configure the channel graphs stacked in the ARGUS event panel's Channels section.
created: 2026-10-04T18:31
updated: 2026-10-22T17:43
---

## Syntax

```dcode
channels: <series> [, <series> ...] [; <series> ...]
```

## Available in

- An event declaration

## Rules

- `,` adds another series to the current graph.
- `;` starts a new graph group.
- A channel series is `|channel|` and may append `@1` through `@5` to select its Y axis; omitted axes use axis 1.
- `>value`, `>=value`, `<value`, and `<=value` draw threshold regions. `=value` draws a horizontal line. Every overlay may also append an axis suffix.

## Example

```dcode
channels: |channel|@1, >100@1; |other_channel|@1
```
