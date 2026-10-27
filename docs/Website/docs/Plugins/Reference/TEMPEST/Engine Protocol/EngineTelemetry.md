---
title: EngineTelemetry
summary: Typed best-effort observations and complete snapshots.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Typed best-effort observations and complete snapshots.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
using EngineTelemetry = std::variant<ChannelUpdates, ChannelSnapshot,
                                     ArgusEvent, ArgusBoardSnapshot>;
```
