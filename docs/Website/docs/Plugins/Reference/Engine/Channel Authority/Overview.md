---
title: Channel Authority
summary: Acquire, command, update, and release write authority for engine channels.
created: 2026-08-04T17:38
updated: 2026-10-27T14:08
---

| Declaration | Description |
| --- | --- |
| [SDK_API::commandChannel](SDK_API-commandChannel.md) | Acquires automatic ownership and writes atomically for an eligible local runtime. |
| [SDK_API::commandChannelAuthorityOnly](SDK_API-commandChannelAuthorityOnly.md) | Acquire automatic ownership without writing. |
| [SDK_API::commandChannelFixed](SDK_API-commandChannelFixed.md) | Apply command authority to a retained local fixed channel, optionally writing a value. |
| [ControlPolicy](ControlPolicy.md) | Authority policy applied to commandable channels. |
| [SDK_API::freeChannel](SDK_API-freeChannel.md) | Releases all of the local caller's claims without writing a value. |
| [SDK_API::freeChannelWithValue](SDK_API-freeChannelWithValue.md) | Write a final value and release all of the caller's claims atomically. |
| [SDK_API::freeChannelFixed](SDK_API-freeChannelFixed.md) | Apply free authority to a retained local fixed channel, optionally writing a value. |
| [SDK_API::overrideChannelAuthorityOnly](SDK_API-overrideChannelAuthorityOnly.md) | Acquire an automatic override without writing. |
| [SDK_API::overrideChannel](SDK_API-overrideChannel.md) | Acquire an automatic override and write atomically. |
| [SDK_API::overrideChannelFixed](SDK_API-overrideChannelFixed.md) | Apply override authority to a retained local fixed channel, optionally writing a value. |
| [SDK_API::setChannel](SDK_API-setChannel.md) | Establishes observe-only authority for an eligible local runtime, optionally writing atomically. |
| [SDK_API::setChannelFixed](SDK_API-setChannelFixed.md) | Apply set authority to a retained local fixed channel, optionally writing a value. |
