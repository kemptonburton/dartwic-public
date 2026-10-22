---
title: "upsertChannelReference"
summary: "Insert or update a typed channel reference without taking automation authority."
---

## Syntax

```dcode
upsertChannelReference(reference, data)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Example

```lua
upsertChannelReference(channel_reference, data)
```
