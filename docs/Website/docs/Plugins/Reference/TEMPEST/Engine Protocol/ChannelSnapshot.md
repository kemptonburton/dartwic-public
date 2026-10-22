---
title: "ChannelSnapshot"
summary: "One channel returned by a query, with its data and owner/session/revision lineage."
---

## API

One channel returned by a query, with its data and owner/session/revision lineage.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelSnapshot {
    std::string owner_node;
    std::string channel;
    Value::Object channel_data;
    uint64_t revision = 0;
    std::string source_session_id;
};
```
