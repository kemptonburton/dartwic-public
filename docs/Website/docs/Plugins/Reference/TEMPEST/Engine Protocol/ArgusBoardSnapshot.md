---
title: "ArgusBoardSnapshot"
summary: "Complete current event board."
---

## API

Complete current event board.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusBoardSnapshot {
    std::vector<ArgusEvent> events;
    std::string owner_node;
};
```
