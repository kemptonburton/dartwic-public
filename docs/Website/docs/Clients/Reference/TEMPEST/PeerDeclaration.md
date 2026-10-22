---
title: "PeerDeclaration"
summary: "Explicit connection contract declared before an incoming peer is constructed."
---

## API

Explicit connection contract declared before an incoming peer is constructed.

Namespace: `TEMPEST`.

```cpp
#include <tempest/ZmqPeer.h>
```

## Declaration

```cpp
struct PeerDeclaration {
    std::string peer_id;
    uint64_t peer_version = 1;
    std::string protocol_id;
    uint64_t protocol_version = 1;
};
```
