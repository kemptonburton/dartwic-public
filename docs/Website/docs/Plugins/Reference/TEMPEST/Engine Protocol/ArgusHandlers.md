---
title: "ArgusHandlers"
summary: "Application handlers for incoming ARGUS queries, actions, and telemetry."
---

## API

Application handlers for incoming ARGUS queries, actions, and telemetry. Install before Peer.start so initial synchronization can be served.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusHandlers {
    std::function<ArgusQueryResult(const ArgusQuery&)> query;
    std::function<ArgusActionResult(const ArgusAction&)> action;
    std::function<void(const ArgusEventTelemetry&)> telemetry;
};
```
