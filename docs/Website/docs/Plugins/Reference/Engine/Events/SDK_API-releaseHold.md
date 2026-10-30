---
title: "SDK_API::releaseHold"
summary: "Release all active hold requests with this title on the current Engine. Completes local release synchronously; recording and telemetry are asynchronous. May allocate and lock. Does not release a timeline clock hold. Channel-write failures throw."
---

## Declaration

```cpp
virtual int releaseHold(const std::string& title) {
            throw std::runtime_error("ARGUS releaseHold is not supported by this host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `title` | Hold title. |

## Returns

1 when matching requests are released, 0 when none match.
