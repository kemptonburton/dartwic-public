---
title: "ChannelUpsert"
summary: "Channel field write or telemetry update, including optional snapshot data and owner/session/revision lineage."
---

## API

Channel field write or telemetry update, including optional snapshot data and owner/session/revision lineage.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelUpsert {
    std::string owner_node;
    std::string channel;
    std::string field = "value";
    Value value;
    std::optional<uint64_t> timestamp;
    std::vector<ChannelSample> samples;
    Value::Object channel_data;
    std::string command_origin;
    std::string automation_operation;
    uint64_t revision = 0;
    std::string source_session_id;
    bool take_manual_control = false;
    bool release_manual_override = false;
};
```
