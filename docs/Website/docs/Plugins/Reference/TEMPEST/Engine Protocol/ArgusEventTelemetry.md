---
title: "ArgusEventTelemetry"
summary: "One-way ARGUS event creation, update, or removal, with ownership and relay route."
---

## API

One-way ARGUS event creation, update, or removal, with ownership and relay route.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusEventTelemetry {
    enum class Kind { Created, Updated, Removed };
    Kind kind = Kind::Created;
    std::string owner_node;
    ArgusEvent event;
    std::vector<std::string> route;
};
```
