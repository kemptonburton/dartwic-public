---
title: "LogEntry"
summary: "Text output from one process stream."
---

## API

Text output from one process stream. Sequence is scoped to node/session/stream.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct LogEntry {
    std::string owner_node;
    std::string session;
    std::string stream;
    std::string channel = "stdout";
    std::string level = "info";
    std::string text;
    uint64_t sequence = 0;
    uint64_t timestamp_ns = 0;
};
```
