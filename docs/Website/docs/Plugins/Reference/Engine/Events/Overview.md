---
title: Events
summary: Report events, stop firing, and run operator holds and typed prompts.
created: 2026-09-04T17:13
updated: 2026-10-28T22:40
---

| Declaration | Description |
| --- | --- |
| [SDK_API::abort](SDK_API-abort.md) | Report an ARGUS abort using the same arguments and defaults as DCode. |
| [SDK_API::error](SDK_API-error.md) | Report an ARGUS error using the same arguments and defaults as DCode. |
| [SDK_API::hold](SDK_API-hold.md) | Block the calling thread until the hold is released. |
| [SDK_API::message](SDK_API-message.md) | Report an ARGUS message using the same arguments and defaults as DCode. |
| [SDK_API::promptNumerical](SDK_API-promptNumerical.md) | Block the calling thread until a numerical response arrives. |
| [SDK_API::promptOptions](SDK_API-promptOptions.md) | Block the calling thread until an option is selected. |
| [SDK_API::promptString](SDK_API-promptString.md) | Block the calling thread until a text response arrives. |
| [SDK_API::promptYesNo](SDK_API-promptYesNo.md) | Block the calling thread until a yes/no response arrives. |
| [SDK_API::recordEvent](SDK_API-recordEvent.md) | Creates or refreshes a correlated ARGUS event from a JSON declaration. |
| [SDK_API::releaseHold](SDK_API-releaseHold.md) | Release all active hold requests with this title on the current Engine. |
| [SDK_API::stop_event_firing](SDK_API-stop_event_firing.md) | End the locally owned event's current firing without resolving or deleting it. |
| [SDK_API::warning](SDK_API-warning.md) | Report an ARGUS warning using the same arguments and defaults as DCode. |
