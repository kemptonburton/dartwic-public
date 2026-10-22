---
title: "ArgusQuery"
summary: "ARGUS event selection by identity, status, type, owner, time range, limit, and additional filters."
---

## API

ARGUS event selection by identity, status, type, owner, time range, limit, and additional filters.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusQuery {
    std::string event_id;
    std::string status;
    std::string type;
    std::string owner_node;
    uint64_t since = 0;
    uint64_t until = 0;
    size_t limit = 0;
    Value::Object filters;
};
```
