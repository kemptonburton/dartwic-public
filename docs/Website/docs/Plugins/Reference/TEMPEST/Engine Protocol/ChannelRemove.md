---
title: "ChannelRemove"
summary: "Channel deletion identified by owner and channel, with optional session/revision lineage."
---

## API

Channel deletion identified by owner and channel, with optional session/revision lineage.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelRemove {
    std::string owner_node;
    std::string channel;
    uint64_t revision = 0;
    std::string source_session_id;
};
```
