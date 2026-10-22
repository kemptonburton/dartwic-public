---
title: "LogQuery"
summary: "Selects one node, process session, and stream, with optional sequence, text, channel, level, and UTC nanosecond time filters."
---

## API

Selects one node, process session, and stream, with optional sequence, text, channel, level, and UTC nanosecond time filters.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct LogQuery {
    std::string owner_node;
    std::string session;
    std::string stream;
    std::string text;
    uint64_t before = 0;
    uint64_t after = 0;
    size_t limit = 250;
    std::string channel;
    std::string level;
    uint64_t from_ns = 0;
    uint64_t to_ns = 0;
};
```
