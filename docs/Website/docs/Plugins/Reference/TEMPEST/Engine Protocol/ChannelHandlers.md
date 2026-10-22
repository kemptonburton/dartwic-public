---
title: "ChannelHandlers"
summary: "Application handlers for incoming channel commands, queries, and telemetry."
---

## API

Application handlers for incoming channel commands, queries, and telemetry. Install before Peer.start so initial synchronization can be served.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelHandlers {
    std::function<void(const ChannelUpsert&)> upsert;
    std::function<void(const ChannelRemove&)> remove;
    std::function<void(const ChannelBulkUpsert&)> bulk_upsert;
    std::function<ChannelQueryResult(const ChannelQuery&)> query;
    std::function<void(const ChannelTelemetry&)> telemetry;
    std::function<void(const ChannelSnapshotTelemetry&)> snapshot;
    std::function<void(const FixedGenerationTelemetry&)> fixed_generation;
};
```
