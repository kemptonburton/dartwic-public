---
title: "ChannelChange"
summary: "A requested change to one channel."
---

## API

A requested change to one channel. Identity and authority are not writable fields.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelChange {
    std::string channel;
    ChannelFields fields;
};
```
