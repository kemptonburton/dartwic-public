---
title: startDataFrame
summary: Save a live time range starting at engine time and return its frame ID. Options can select channels, event and log modes (all, related, off), nodes, and named log streams. A missing channel list includes all recorded channels in the range. Recording policy is unchanged.
created: 2026-10-04T18:31
updated: 2026-10-14T22:39
---

## Syntax

```dcode
startDataFrame(name, options?)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Uses the engine dataframe registry; may allocate or wait on the calling callback.

## Example

```lua
startDataFrame("Test", {})
```
