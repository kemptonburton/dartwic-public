---
title: "SDK_API::commandChannel"
summary: "Commands a channel while using the active task or loop as controller."
---

## Declaration

```cpp
virtual void commandChannel(const std::string& channel, ChannelValue value) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel name. |
| `value` | Commanded value. |
