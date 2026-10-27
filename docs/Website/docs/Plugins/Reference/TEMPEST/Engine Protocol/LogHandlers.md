---
title: LogHandlers
summary: Supported log-history commands and incoming batches of entries.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Supported log-history commands and incoming batches of entries.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct LogHandlers {
    std::function<std::vector<LogEntry>(const LogQuery &)> queryCommand;
    std::function<void(const std::vector<LogEntry> &)> logTelemetry;
    std::function<std::vector<LogStream>()> listCommand;
};
```
