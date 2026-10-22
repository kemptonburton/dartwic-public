---
title: TransportPath
summary: One observed transport path.
created: 2026-09-26T14:51
updated: 2026-09-29T17:19
---

## API

One observed transport path. A shared socket is reported once by its owner.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Transport.h>
```

## Declaration

```cpp
struct TransportPath {
    std::string id;
    std::string role;
    std::string endpoint;
    std::string state = "unknown";
    bool shared = false;
    uint64_t last_receive_ms = 0;
    uint64_t last_send_ms = 0;
    std::size_t queued = 0;
    uint64_t dropped = 0;
    std::string last_error;
    std::string transport = "unknown";
    uint64_t bytes_sent = 0;
    uint64_t bytes_received = 0;
    bool byte_counters_available = false;
};
```
