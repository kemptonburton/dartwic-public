---
title: SDK_API::freeChannelFixed
summary: Apply free authority to a retained local fixed channel, optionally writing a value. Without an eligible owner, a supplied value is an ordinary write and omission is a no-op.
created: 2026-10-26T18:30
updated: 2026-10-26T19:26
---

## Declaration

```cpp
void freeChannel(const FixedChannelHandle& channel, std::optional<ChannelValue> value = std::nullopt) {
            applyAuthorityByHandle(3, channel, std::move(value));
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Retained local handle; stale bindings are rejected. |
| `value` | Optional numeric value; local authority transition and write are atomic. |
