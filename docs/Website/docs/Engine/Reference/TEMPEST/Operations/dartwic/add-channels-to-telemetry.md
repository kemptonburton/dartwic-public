---
title: dartwic/add-channels-to-telemetry
summary: Adds channels to telemetry.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Clients and Telemetry

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_names` | `array<string>` | Required | RAPID channels to subscribe the requesting client to. Non-string entries are ignored. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channels` | `object<string, integer>` | Updated reference count keyed by each accepted channel name. |
| `initial` | `object<string, object>` | Initial live snapshots keyed by channel name. |
