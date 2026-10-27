---
title: "ArgusEvent"
summary: "ARGUS event identity, presentation, ownership, channel references, and details."
---

## API

ARGUS event identity, presentation, ownership, channel references, and details. The engine interprets timestamp as Unix nanoseconds when created_at_ns is absent.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusEvent {
    std::string event_id;
    EventType type = EventType::Message;
    std::string title;
    std::string description;
    std::string status = "new";
    std::string owner_node;
    uint64_t timestamp = 0;
    std::vector<std::string> channels;
    Value::Object details;
    double separation_seconds = std::numeric_limits<double>::quiet_NaN();
};
```
