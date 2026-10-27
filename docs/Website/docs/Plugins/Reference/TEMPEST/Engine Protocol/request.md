---
title: request
summary: Validate and parse a TEMPEST operation argument object.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Validate and parse a TEMPEST operation argument object.

Namespace: `DARTWIC::EngineContract`.

```cpp
#include <dartwic/EngineProtocol.h>
```

## Declaration

```cpp
EngineRequest request(const std::string &operation,
                      const Value::Object &arguments);
```
