---
title: "ChannelRemoveRequest"
summary: "Owner-directed deletion of one channel."
---

## API

Owner-directed deletion of one channel.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelRemoveRequest {
    std::string channel;
    std::string command_origin;
};
```
