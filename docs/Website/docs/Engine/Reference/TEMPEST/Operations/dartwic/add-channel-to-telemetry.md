---
title: dartwic/add-channel-to-telemetry
summary: Adds channel to telemetry.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Clients and Telemetry

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_name` | `string` | Required | RAPID channel name to subscribe the requesting client to. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channel` | `string` | Subscribed channel name. |
| `count` | `integer` | This client's reference count for the channel after subscribing. |
| `snapshot` | `object` | Initial live channel snapshot. |
