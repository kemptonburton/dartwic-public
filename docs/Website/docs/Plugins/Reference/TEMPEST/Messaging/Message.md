---
title: Message
summary: Operations, replies and telemetry share this in-memory envelope.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Operations, replies and telemetry share this in-memory envelope. A transport chooses its encoding. The deadline is local monotonic time and must not be transmitted as a remote clock value.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Transport.h>
```

## Declaration

```cpp
struct Message {
    enum class Kind { Request, Response, Telemetry };
    Kind kind = Kind::Request;
    std::string request_id;
    std::string name;
    Value::Object payload;
    bool error = false;
    std::string error_code;
    std::chrono::steady_clock::time_point deadline =
          std::chrono::steady_clock::time_point::max();
};
```
