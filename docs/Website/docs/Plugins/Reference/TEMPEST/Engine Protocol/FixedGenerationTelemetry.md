---
title: "FixedGenerationTelemetry"
summary: "Writes belonging to one source generation, with a source timestamp and relay route."
---

## API

Writes belonging to one source generation, with a source timestamp and relay route.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct FixedGenerationTelemetry {
    std::string owner_node;
    uint64_t generation = 0;
    uint64_t source_timestamp = 0;
    std::vector<FixedGenerationWrite> writes;
    std::vector<std::string> route;
};
```
