---
title: "Channels"
summary: "Read and modify channel definitions, values, fields, and history through the Engine SDK."
---

| Declaration | Description |
| --- | --- |
| [ChannelField](ChannelField.md) | Addressable fields stored for each RAPID channel. |
| [ChannelValue](ChannelValue.md) | Value types accepted by channel read, write, and authority APIs. |
| [SDK_API::createFixedChannel](SDK_API-createFixedChannel.md) | Creates a channel in fixed RAPID storage, or promotes an existing dynamic channel. |
| [FixedChannelHandle](FixedChannelHandle.md) | Stable retained address of a fixed RAPID channel. |
| [SDK_API::insertChannelField](SDK_API-insertChannelField.md) | Creates a missing channel with an initial field value; an existing channel is left unchanged. |
| [SDK_API::queryChannel](SDK_API-queryChannel.md) | Reads the current numeric value from a retained local fixed-channel handle. |
| [SDK_API::queryChannelField](SDK_API-queryChannelField.md) | Reads a typed field and returns the supplied default when the field is unavailable. |
| [RecordMode](RecordMode.md) | Controls when channel values are recorded to persistence. |
| [SDK_API::removeChannel](SDK_API-removeChannel.md) | Removes a channel and its associated field data. |
| [SDK_API::upsertChannel](SDK_API-upsertChannel.md) | Attempts an immediate numeric write without claiming authority. |
| [SDK_API::upsertChannelField](SDK_API-upsertChannelField.md) | Creates or replaces a field on a RAPID channel. |
| [SDK_API::upsertChannelValueBulk](SDK_API-upsertChannelValueBulk.md) | Writes timestamped numeric samples to one channel in a single call. |
