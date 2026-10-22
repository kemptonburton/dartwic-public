---
title: dartwic/update-console-message
summary: Updates a console message through its backing ARGUS event.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Optional | Stable event ID. A title lookup is used when omitted. |
| `message_title` | `string` | Optional | Active console-message title used when `event_id` is omitted. |
| `title` | `string` | Optional | Alias for `message_title`. |
| `update_parameters` | `object` | Optional | Metadata stored with the update. Its `status_type` or `status` field selects the new status; the default is `acknowledged`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `updated` | `boolean` | Whether the backing ARGUS event was updated. |

## Errors

- No console message can be resolved.
