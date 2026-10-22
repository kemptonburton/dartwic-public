---
title: channels
summary: Configure the channel graphs stacked in the ARGUS event panel's Channels section.
created: 2026-10-04T18:31
updated: 2026-10-14T13:14
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

```lua
channels: |channel|@${2|1,2,3,4,5|}, >100@${4|1,2,3,4,5|}; |other_channel|@${6|1,2,3,4,5|}
```
