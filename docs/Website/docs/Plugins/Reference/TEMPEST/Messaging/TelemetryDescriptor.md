---
title: "TelemetryDescriptor"
summary: "A peer-visible telemetry topic."
---

## API

A peer-visible telemetry topic. Payload encoding remains the transport's concern.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Peer.h>
```

## Declaration

```cpp
struct TelemetryDescriptor {
    std::string topic;
    std::string display_name;
    std::string description;
    std::string category;
    std::string direction;
    std::string delivery;
    std::string plugin_id;
};
```
