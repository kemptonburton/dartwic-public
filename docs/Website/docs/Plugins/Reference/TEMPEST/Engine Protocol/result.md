---
title: result
summary: Map a typed result to its TEMPEST response object.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Map a typed result to its TEMPEST response object.

Namespace: `DARTWIC::EngineContract`.

```cpp
#include <dartwic/EngineProtocol.h>
```

## Declaration

```cpp
Value::Object result(const ChannelQueryResult &result);
Value::Object result(const ArgusQueryResult &result);
Value::Object result(const ArgusActionResult &result);
```
