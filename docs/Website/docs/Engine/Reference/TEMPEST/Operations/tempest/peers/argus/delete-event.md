---
title: tempest/peers/argus/delete-event
summary: Deletes an event from a remote ARGUS runtime.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Optional | Stable event ID. A title lookup is used when omitted. |
| `message_title` | `string` | Optional | Active event title used when `event_id` is omitted. |
| `title` | `string` | Optional | Alias for `message_title`. |
| `operator_client_id` | `string` | Optional | Original requesting client ID; defaults to the authenticated caller. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | `boolean` | Whether the event was marked deleted. |
| `event_id` | `string` | Resolved event ID. |

## Errors

- No event can be resolved or the event is still firing.
