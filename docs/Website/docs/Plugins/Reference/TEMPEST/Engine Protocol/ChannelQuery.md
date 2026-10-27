---
title: "ChannelQuery"
summary: "Current channel names and optional field selection; empty selections mean all."
---

## API

Current channel names and optional field selection; empty selections mean all.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelQuery {
    std::vector<std::string> channels;
    std::vector<std::string> fields;
};
```
