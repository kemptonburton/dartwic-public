---
title: "SerializedTelemetryTransport"
summary: "Optional adapter optimization for complete, replaceable telemetry snapshots."
---

## API

Optional adapter optimization for complete, replaceable telemetry snapshots. The caller supplies a validated payload in the named encoding. Unsupported adapters return false so the caller can use the ordinary typed send path. This separate interface leaves custom Transport implementations unchanged.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Transport.h>
```

## Declaration

```cpp
class SerializedTelemetryTransport {
public:
    virtual ~SerializedTelemetryTransport() = default;
    virtual bool sendSerializedTelemetry(std::string topic, std::string encoding,
            std::shared_ptr<const std::string> payload) = 0;
};
```
