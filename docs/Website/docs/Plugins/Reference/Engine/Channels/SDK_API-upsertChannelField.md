---
title: "SDK_API::upsertChannelField"
summary: "Creates or replaces a field on a RAPID channel."
---

## Declaration

```cpp
virtual void upsertChannelField(const std::string& channel,
            ChannelField field,
            ChannelValue value,
            ChannelStorage storage = ChannelStorage::Dynamic) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel name. |
| `field` | Field to write. |
| `value` | New field value. |
| `storage` | Storage used only when creating or promoting the channel; defaults to dynamic. |
