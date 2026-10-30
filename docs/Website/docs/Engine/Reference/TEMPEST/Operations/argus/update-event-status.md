---
title: argus/update-event-status
summary: |-
  Updates event status. Resolving a retained remote event while its owner is
  disconnected clears only this Engine's board and records a local operator
  action. Source status/firing history are preserved; reconnect can restore it.
created: 2026-08-03T16:00
updated: 2026-10-29T00:32
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Optional | Stable event ID. When omitted, the first active event matching `message_title` or `title` is used. |
| `message_title` | `string` | Optional | Active event title used when `event_id` is omitted. |
| `title` | `string` | Optional | Alias for `message_title`. |
| `status` | `string` | Optional | New event status. `status_type` is accepted as an alias. |
| `status_type` | `string` | Optional | Alias for `status`. |
| `payload` | `object` | Optional | Operator-response metadata stored with the status change. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `updated` | `boolean` | Whether the event status was changed. |
| `event_id` | `string` | Resolved event ID. |
| `status` | `string` | Status applied to the event. |
| `local_only` | `boolean` | True when only the disconnected owner observation was cleared locally. |
| `owner_updated` | `boolean` | False for a local-only board resolution. |

## Errors

- No event ID/title can be resolved, no status is supplied, or `resolved` is requested while the event is still firing.
