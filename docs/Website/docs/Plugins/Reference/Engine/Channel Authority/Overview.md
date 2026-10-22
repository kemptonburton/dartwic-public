---
title: Channel Authority
summary: Acquire, command, update, and release write authority for engine channels.
created: 2026-08-04T17:38
updated: 2026-09-07T18:59
---

| Declaration | Description |
| --- | --- |
| [SDK_API::claimChannel](SDK_API-claimChannel.md) | Claims channel authority for the active task or loop controller. |
| [SDK_API::commandChannel](SDK_API-commandChannel.md) | Commands a channel while using the active task or loop as controller. |
| [ControlPolicy](ControlPolicy.md) | Authority policy applied to commandable channels. |
| [SDK_API::freeChannel](SDK_API-freeChannel.md) | Releases authority previously claimed by the active controller. |
| [SDK_API::setChannel](SDK_API-setChannel.md) | Establishes observe-only authority for the active task or loop, optionally writing its value. |
