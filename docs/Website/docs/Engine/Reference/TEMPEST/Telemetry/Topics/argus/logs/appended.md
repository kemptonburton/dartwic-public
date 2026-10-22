---
title: argus/logs/appended
summary: Publishes appended log records to a subscribed client.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Logs
- **Direction:** Server → clients

## Delivery

Published when the watched stream receives new records.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `watch_id` | `string` | Always | Subscription identity. |
| `records` | `array` | Always | New records in the selected stream. |
