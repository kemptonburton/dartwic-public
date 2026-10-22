---
title: "SDK_API::upsertChannel"
summary: "Attempts an immediate numeric write without claiming authority. A retired handle fails instead of creating a replacement channel."
---

## Declaration

```cpp
virtual bool upsertChannel(const FixedChannelHandle& handle, double value,
            std::optional<uint64_t> timestamp = std::nullopt) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `handle` | Handle returned by createFixedChannel. |
| `value` | Numeric value to write. |
| `timestamp` | Optional Unix-epoch nanosecond timestamp. |

## Returns

Whether the owner accepted the write.
