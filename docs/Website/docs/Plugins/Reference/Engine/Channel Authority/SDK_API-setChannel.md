---
title: SDK_API::setChannel
summary: Establishes observe-only authority for the active task or loop, optionally writing its value.
created: 2026-08-04T17:38
updated: 2026-09-07T18:59
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
