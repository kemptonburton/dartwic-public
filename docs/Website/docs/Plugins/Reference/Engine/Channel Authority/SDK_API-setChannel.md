---
title: SDK_API::setChannel
summary: Establishes observe-only authority for an eligible local runtime, optionally writing atomically. Remote targets or callers without runtime authority upsert a supplied value or do nothing without one.
created: 2026-08-04T17:38
updated: 2026-10-26T19:04
---

## Declaration

```cpp
virtual void setChannel(const std::string& channel, std::optional<ChannelValue> value = std::nullopt) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel name. |
| `value` | Optional value; omitting it preserves the current numeric value. |
