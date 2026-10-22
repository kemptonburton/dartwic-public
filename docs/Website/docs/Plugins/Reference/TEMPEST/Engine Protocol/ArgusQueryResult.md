---
title: "ArgusQueryResult"
summary: "ARGUS events returned by a peer, with result and total counts."
---

## API

ARGUS events returned by a peer, with result and total counts.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusQueryResult {
    std::vector<ArgusEvent> events;
    size_t count = 0;
    size_t total_count = 0;
};
```
