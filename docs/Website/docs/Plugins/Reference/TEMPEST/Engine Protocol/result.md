---
title: "result"
summary: "Map a typed result to its TEMPEST response object."
---

## API

Map a typed result to its TEMPEST response object.

Namespace: `DARTWIC::EngineContract`.

```cpp
#include <dartwic/EngineProtocol.h>
```

## Declaration

```cpp
Value::Object result(const ChannelQueryResult& result);
Value::Object result(const ArgusQueryResult& result);
Value::Object result(const ArgusActionResult& result);
```
