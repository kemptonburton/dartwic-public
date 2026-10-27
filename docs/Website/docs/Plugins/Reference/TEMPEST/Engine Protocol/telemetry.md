---
title: telemetry
summary: Parse a known topic and its application object.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Parse a known topic and its application object.

Namespace: `DARTWIC::EngineContract`.

```cpp
#include <dartwic/EngineProtocol.h>
```

## Declaration

```cpp
EngineTelemetry telemetry(const std::string &topic,
                          const Value::Object &payload);
```
