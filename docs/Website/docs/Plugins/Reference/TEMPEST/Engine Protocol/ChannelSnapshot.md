---
title: "ChannelSnapshot"
summary: "Complete shared selection; an empty selection clears the receiver's mirror."
---

## API

Complete shared selection; an empty selection clears the receiver's mirror.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelSnapshot {
    ChannelUpdates channels;
    std::string owner_node;
};
```
