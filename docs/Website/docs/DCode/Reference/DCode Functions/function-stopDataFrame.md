---
title: stopDataFrame
summary: Close a live dataframe time range by its returned ID at engine time. Recording policy and channel samples are unchanged.
created: 2026-10-04T18:31
updated: 2026-10-14T22:39
---

## Syntax

```dcode
stopDataFrame(id)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Uses the engine dataframe registry; may wait on the calling callback.

## Example

```lua
stopDataFrame(id)
```
