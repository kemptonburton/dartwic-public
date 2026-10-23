---
title: insertChannelReference
summary: Insert a typed channel reference without taking automation authority.
created: 2026-09-04T17:13
updated: 2026-10-22T17:41
---

## Syntax

```dcode
insertChannelReference(reference, data)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Example

```dcode
insertChannelReference(channel_reference, data)
```
