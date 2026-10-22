---
title: "ZmqPeerConfig"
summary: "Default ZeroMQ connection and advertised endpoints."
---

## API

Default ZeroMQ connection and advertised endpoints. Zero local ports choose available ports. Use a reachable advertised_host for remote machines.

Namespace: `TEMPEST`.

```cpp
#include <tempest/ZmqPeer.h>
```

## Declaration

```cpp
struct ZmqPeerConfig {
    std::string host = "127.0.0.1";
    int port = 7200;
    std::string password = "admin";
    std::string bind_host = "127.0.0.1";
    std::string advertised_host = "127.0.0.1";
    int operations_port = 0;
    int telemetry_port = 0;
    std::size_t max_queued_messages = 4096;
};
```
