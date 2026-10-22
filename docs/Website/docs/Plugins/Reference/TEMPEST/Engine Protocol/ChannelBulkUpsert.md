---
title: "ChannelBulkUpsert"
summary: "Batch of timestamped samples for one channel."
---

## API

Batch of timestamped samples for one channel. A command requires at least one sample.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelBulkUpsert {
    std::string owner_node;
    std::string channel;
    std::vector<ChannelSample> samples;
    std::string command_origin;
    uint64_t revision = 0;
    std::string source_session_id;
};
```
