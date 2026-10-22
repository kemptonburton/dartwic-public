---
title: "FixedGenerationWrite"
summary: "One field write within a fixed-generation telemetry batch."
---

## API

One field write within a fixed-generation telemetry batch.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct FixedGenerationWrite {
    std::string channel;
    std::string field = "value";
    Value value;
    std::optional<uint64_t> timestamp;
    uint64_t revision = 0;
};
```
