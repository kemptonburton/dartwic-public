---
title: "SDK_API::insertChannelField"
summary: "Creates a missing channel with an initial field value; an existing channel is left unchanged."
---

This is a no-op for an existing channel, including its storage class. To promote existing storage, use upsertChannelField with Fixed storage during configuration.

## Declaration

```cpp
virtual void insertChannelField(const std::string& channel,
            ChannelField field,
            ChannelValue value,
            ChannelStorage storage = ChannelStorage::Dynamic) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel name. |
| `field` | Field to insert. |
| `value` | Initial field value. |
| `storage` | Storage used for a newly created channel; defaults to dynamic. |
