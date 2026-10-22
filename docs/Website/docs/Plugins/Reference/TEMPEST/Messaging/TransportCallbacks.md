---
title: "TransportCallbacks"
summary: "Delivery callbacks supplied by Peer."
---

## API

Delivery callbacks supplied by Peer. Transport control and response correlation must remain independent of application handlers.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Transport.h>
```

## Declaration

```cpp
struct TransportCallbacks {
    std::function<void(Message)> on_message;
    std::function<void(ConnectionState, std::string)> on_state;
};
```
