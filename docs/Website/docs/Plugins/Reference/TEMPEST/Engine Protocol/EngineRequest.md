---
title: "EngineRequest"
summary: "Requests supported by the DARTWIC application contract."
---

## API

Requests supported by the DARTWIC application contract.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
using EngineRequest = std::variant<ChannelUpsert, ChannelRemove, ChannelBulkUpsert, ChannelQuery, ArgusQuery, ArgusAction>;
```
