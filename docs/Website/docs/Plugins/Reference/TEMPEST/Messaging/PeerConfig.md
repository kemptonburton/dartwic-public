---
title: PeerConfig
summary: Explicit peer and protocol identity, deadlines and bounded queue limits.
created: 2026-09-26T01:43
updated: 2026-09-26T14:51
---

## API

Explicit peer and protocol identity, deadlines and bounded queue limits.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Peer.h>
```

## Declaration

```cpp
struct PeerConfig {
    std::string node_name;
    std::string peer_id;
    uint64_t peer_version = 1;
    std::string protocol_id;
    uint64_t protocol_version = 1;
    std::chrono::milliseconds request_timeout{5000};
    std::chrono::milliseconds heartbeat_interval{1000};
    std::chrono::milliseconds heartbeat_timeout{5000};
    std::size_t max_pending_requests = 256;
    std::size_t max_queued_requests = 256;
    std::size_t max_queued_callbacks = 1024;
};
```
