---
title: "ChannelSnapshotTelemetry"
summary: "Complete current channel records sent by one engine peer."
---

## API

Complete current channel records sent by one engine peer.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelSnapshotTelemetry {
    std::string owner_node;
    Value::Object channels;
    std::vector<std::string> route;
};
```
