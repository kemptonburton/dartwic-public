---
title: "ChannelUpdate"
summary: "An observed record; local publications fill missing source lineage automatically."
---

## API

An observed record; local publications fill missing source lineage automatically.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelUpdate {
    std::string channel;
    ChannelFields fields;
    std::string owner_node;
    uint64_t revision = 0;
    std::string source_session_id;
    std::vector<std::string> route;
};
```
