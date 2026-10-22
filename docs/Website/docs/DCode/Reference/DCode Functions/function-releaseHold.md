---
title: "releaseHold"
summary: "Release an ARGUS hold by title."
---

## Syntax

```dcode
releaseHold(title)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Example

```lua
releaseHold(title)
```
