---
title: tempest/peers/argus/get-active-events
summary: Returns active events from a remote ARGUS runtime.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `system` | `string` | Optional | Exact ARGUS system filter. |
| `subsystem` | `string` | Optional | Exact ARGUS subsystem filter. |
| `type` | `string` | Optional | Exact event-type filter. |
| `status` | `string` | Optional | Exact event-status filter. |
| `node` | `string` | Optional | Accepted for compatibility; the receiving engine replaces it with its own node name. |
| `channel` | `string` | Optional | Exact related-channel filter. |
| `text` | `string` | Optional | Free-text filter. `query` is accepted as an alias. |
| `query` | `string` | Optional | Alias for `text`. |
| `session_id` | `string` | Optional | Exact ARGUS session filter. |
| `from_ns` | `integer` | Optional | Inclusive lower timestamp bound in Unix-epoch nanoseconds. |
| `to_ns` | `integer` | Optional | Inclusive upper timestamp bound in Unix-epoch nanoseconds. |
| `limit` | `integer` | Optional | Maximum event count; defaults to 500. |
| `offset` | `integer` | Optional | Zero-based result offset; defaults to 0. |
| `active_only` | `boolean` | Optional | Accepted for query compatibility; this operation always forces active-only behavior. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `events` | `array<ArgusEvent>` | Matching active events from this engine. |
| `count` | `integer` | Number of events in this page. |
| `total_count` | `integer` | Total matching active-event count. |
