---
title: ConnectionState
summary: Peer lifecycle state; Connected means registration completed.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Peer lifecycle state; Connected means registration completed.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Transport.h>
```

## Declaration

```cpp
enum class ConnectionState {
  Disconnected,
  Connecting,
  Connected,
  Reconnecting,
  Stopping
};
```
