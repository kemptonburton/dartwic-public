---
title: dartwic/release-hold
summary: Releases hold.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Optional | Stable hold event ID used for operator-response recording. |
| `message_title` | `string` | Optional | Active event title used to resolve `event_id`. |
| `hold_title` | `string` | Optional | In-memory hold title to release. |
| `title` | `string` | Optional | Backward-compatible alias for `hold_title`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `event_id` | `string` | Resolved event ID, or an empty string when the hold had no ARGUS event. |

## Errors

- The named hold is not active and the event is not a DCode-declared hold.
