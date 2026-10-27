---
title: ArgusHandlers
summary: Owner-side event commands and incoming event/complete-board telemetry.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Owner-side event commands and incoming event/complete-board telemetry.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusHandlers {
    std::function<ArgusQueryResult(const ArgusQuery &)> queryCommand;
    std::function<ArgusActionResult(const std::string &, const std::string &)>
          updateStatusCommand;
    std::function<ArgusActionResult(const std::string &, const Value::Object &)>
          respondToPromptCommand;
    std::function<ArgusActionResult(const std::string &, const Value::Object &)>
          releaseHoldCommand;
    std::function<ArgusActionResult(const std::string &)> removeCommand;
    std::function<void(const ArgusEvent &)> eventTelemetry;
    std::function<void(const ArgusBoardSnapshot &)> snapshotTelemetry;
};
```
