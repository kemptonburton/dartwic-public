---
title: Transport
summary: Implement start, send and stop for custom framing and I/O.
created: 2026-10-04T18:31
updated: 2026-10-27T16:09
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
    // Begin link I/O; report incoming messages through receive and physical availability through setConnected.
    virtual void start() = 0;
    // Nonblocking bounded enqueue; throw on failed operation enqueue. Best-effort telemetry may be dropped. Honor the original local deadline for unsent messages.
    virtual void send(Message message);
    // Stop link delivery and join I/O before returning.
    virtual void stop() = 0;
    // Return an observational snapshot; unknown fields remain unset.
    virtual std::vector<TransportPath> diagnostics() const;
    protected:
    // Deliver a decoded DARTWIC message into the owning Peer. No application handler runs inline.
    void receive(Message message);
    protected:
    // Report physical link availability; protocol registration establishes readiness separately.
    void setConnected(bool connected, std::string reason = {});
};
```
