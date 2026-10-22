---
title: dartwic/remove-channel-from-telemetry
summary: Removes channel from telemetry.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Clients and Telemetry

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_name` | `string` | Required | RAPID channel whose subscription reference count should be decremented. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channel` | `string` | Channel name, omitted when the client had no subscription. |
| `remaining` | `integer` | Remaining reference count, omitted when the client had no subscription. |
