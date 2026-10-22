---
title: "LogHandlers"
summary: "Callbacks through which an EngineProtocol peer serves log history and receives live logs."
---

## API

Callbacks through which an EngineProtocol peer serves log history and receives live logs.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct LogHandlers {
    std::function<std::vector<LogEntry>(const LogQuery&)> query;
    std::function<void(const LogEntry&)> telemetry;
    std::function<std::vector<LogStream>()> list;
};
```
