---
title: ChannelHandlers
summary: Install before Peer.start.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Install before Peer.start. Commands run on the request worker; telemetry uses the callback worker.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelHandlers {
    std::function<void(const ChannelUpsertRequest &)> upsertCommand;
    std::function<ChannelQueryResult(const ChannelQuery &)> queryCommand;
    std::function<void(const ChannelRemoveRequest &)> removeCommand;
    std::function<void(const ChannelUpdates &)> channelTelemetry;
    std::function<void(const ChannelSnapshot &)> snapshotTelemetry;
};
```
