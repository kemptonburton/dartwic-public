---
title: "makeZmqTransport"
summary: "Create the optional standalone ZeroMQ transport with four socket roles and JSON encoding."
---

## API

Create the optional standalone ZeroMQ transport with four socket roles and JSON encoding. Ordinary TEMPEST clients do not acquire these extra roles.

Namespace: `TEMPEST`.

```cpp
#include <tempest/ZmqPeer.h>
```

## Declaration

```cpp
TransportPtr makeZmqTransport(ZmqPeerConfig config = {});
```
