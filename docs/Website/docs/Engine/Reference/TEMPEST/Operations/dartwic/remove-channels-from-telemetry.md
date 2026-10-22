---
title: dartwic/remove-channels-from-telemetry
summary: Removes channels from telemetry.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Clients and Telemetry

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_names` | `array<string>` | Required | RAPID channels whose subscription reference counts should be decremented. Unknown and non-string entries are ignored. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channels` | `object<string, integer>` | Remaining reference count keyed by every subscription that was changed. |
