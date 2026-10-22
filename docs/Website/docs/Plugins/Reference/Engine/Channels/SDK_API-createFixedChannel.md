---
title: "SDK_API::createFixedChannel"
summary: "Creates a channel in fixed RAPID storage, or promotes an existing dynamic channel."
---

Call during startup configuration or a task's on_configure callback. The engine's declared configuration transaction permits layout updates after active task execution drain, even when the layout is sealed. Direct layout changes outside that boundary remain restricted. Initial value applies only to a new channel; existing fixed values and promoted dynamic state are preserved. Retain the returned handle.

## Declaration

```cpp
virtual FixedChannelHandle createFixedChannel(const std::string& channel,
            double initial_value = 0.0) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel name. |
| `initial_value` | Initial numeric value; defaults to zero. |
