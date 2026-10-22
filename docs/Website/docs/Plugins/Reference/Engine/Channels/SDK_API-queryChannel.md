---
title: "SDK_API::queryChannel"
summary: "Reads the current numeric value from a retained local fixed-channel handle. A retired handle fails instead of resolving its old name."
---

## Declaration

```cpp
virtual double queryChannel(const FixedChannelHandle& handle,
            double default_value = 0.0) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `handle` | Handle returned by createFixedChannel. |
| `default_value` | Value used when no stored value is available. |
