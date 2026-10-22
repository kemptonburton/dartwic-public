---
title: "tempest/peers/argus/update-event-status"
summary: "Updates an event status on a remote ARGUS runtime."
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Optional | Stable event ID. A title lookup is used when omitted. |
| `message_title` | `string` | Optional | Active event title used when `event_id` is omitted. |
| `title` | `string` | Optional | Alias for `message_title`. |
| `status` | `string` | Optional | New event status. `status_type` is accepted as an alias. |
| `status_type` | `string` | Optional | Alias for `status`. |
| `operator_client_id` | `string` | Optional | Original requesting client ID; defaults to the authenticated caller. |
| `payload` | `object` | Optional | Operator-response metadata stored with the status change. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `updated` | `boolean` | Whether the event status was changed. |
| `event_id` | `string` | Resolved event ID. |
| `status` | `string` | Status applied to the event. |

## Errors

- No event ID/title can be resolved, no status is supplied, or `resolved` is requested while the event is still firing.
