---
title: "SDK_API::queryChannelField"
summary: "Reads a typed field and returns the supplied default when the field is unavailable."
---

## Declaration

```cpp
virtual double queryChannelField(const std::string& channel,
            ChannelField field,
            std::optional<ChannelValue> default_value) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel name. |
| `field` | Field to read. |
| `default_value` | Value used when the field is unavailable. |

## Returns

The numeric field value.
