---
title: "ChannelQuery"
summary: "Channel keys and requested fields for a synchronous peer snapshot query."
---

## API

Channel keys and requested fields for a synchronous peer snapshot query.

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
