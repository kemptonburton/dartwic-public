---
title: "PeerClientConfig"
summary: "Named application identity and default link settings."
---

## API

Named application identity and default link settings. Custom transports own their endpoint settings. PeerClient always supplies the shared Engine contract.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/PeerClient.h>
```

## Declaration

```cpp
struct PeerClientConfig {
    std::string node_name;
    std::string host = "127.0.0.1";
    int port = 7200;
    std::string password = "admin";
    std::string peer_id = "tempest.engine";
};
```
