---
title: "EngineTelemetry"
summary: "Telemetry supported by the DARTWIC application contract."
---

## API

Telemetry supported by the DARTWIC application contract.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
using EngineTelemetry = std::variant<ChannelTelemetry, ChannelSnapshotTelemetry,
    FixedGenerationTelemetry, ArgusEventTelemetry>;
```
