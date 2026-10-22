---
title: argus/delete-event
summary: Deletes event.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Optional | Stable event ID. When omitted, an active event is resolved by title. |
| `message_title` | `string` | Optional | Active event title used when `event_id` is omitted. |
| `title` | `string` | Optional | Alias for `message_title`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | `boolean` | Whether the event was marked deleted. |
| `event_id` | `string` | Resolved event ID. |

## Errors

- No event can be resolved or the event is still firing.
