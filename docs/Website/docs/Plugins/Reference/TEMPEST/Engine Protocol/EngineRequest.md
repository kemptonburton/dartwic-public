---
title: EngineRequest
summary: Typed synchronous requests carried by the shared Engine contract.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Typed synchronous requests carried by the shared Engine contract.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
using EngineRequest = std::variant<ChannelUpsertRequest, ChannelRemoveRequest,
                                   ChannelQuery, ArgusQuery, ArgusAction>;
```
