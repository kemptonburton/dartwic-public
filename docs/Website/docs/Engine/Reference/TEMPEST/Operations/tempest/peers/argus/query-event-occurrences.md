---
title: "tempest/peers/argus/query-event-occurrences"
summary: "Queries occurrence records for an event owned by this engine."
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Required | Stable ARGUS event ID. |
| `limit` | `integer` | Optional | Maximum occurrence count; defaults to 100. |
| `offset` | `integer` | Optional | Zero-based result offset; defaults to zero. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `occurrences` | `array<object>` | Matching occurrence records. |

## Errors

- The event ID is missing or the ARGUS query fails.
