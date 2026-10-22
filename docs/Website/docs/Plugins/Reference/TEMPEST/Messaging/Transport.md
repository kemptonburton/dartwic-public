---
title: Transport
summary: Implement start, send and stop for custom framing and I/O.
created: 2026-09-26T01:43
updated: 2026-09-26T14:51
---

## API

Implement start, send and stop for custom framing and I/O. Peer owns registration, correlation, deadlines, heartbeats and application dispatch. Serialize access to owned sockets on the I/O worker. Never replay accepted commands after reconnect.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Transport.h>
```

## Declaration

```cpp
class Transport {
public:
    virtual ~Transport() = default;
    // Install callbacks and begin delivery. Report underlying link availability with on_state.
    virtual void start(TransportCallbacks callbacks) = 0;
    // Nonblocking bounded enqueue; throw on failed operation enqueue. Best-effort telemetry may be dropped. Honor the original local deadline for unsent messages.
    virtual void send(Message message) = 0;
    // Release callbacks and stop delivery before returning.
    virtual void stop() = 0;
    // Return an observational snapshot; unknown fields remain unset.
    virtual std::vector<TransportPath> diagnostics() const;
};
```
