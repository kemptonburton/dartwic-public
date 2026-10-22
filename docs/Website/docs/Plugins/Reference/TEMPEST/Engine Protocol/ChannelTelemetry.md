---
title: "ChannelTelemetry"
summary: "One-way channel upsert, removal, or bulk update."
---

## API

One-way channel upsert, removal, or bulk update. Kind selects the corresponding payload member.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelTelemetry {
    enum class Kind { Upsert, Remove, BulkUpsert };
    Kind kind = Kind::Upsert;
    ChannelUpsert upsert;
    ChannelRemove remove;
    ChannelBulkUpsert bulk;
    std::vector<std::string> route;
};
```
