---
title: "ConnectionState"
summary: "Peer lifecycle state; Connected means registration completed."
---

## API

Peer lifecycle state; Connected means registration completed.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Transport.h>
```

## Declaration

```cpp
enum class ConnectionState { Disconnected, Connecting, Connected, Reconnecting, Stopping };
```
