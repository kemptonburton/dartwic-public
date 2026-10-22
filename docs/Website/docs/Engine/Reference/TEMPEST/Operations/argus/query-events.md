---
title: argus/query-events
summary: Queries events from the local ARGUS store and connected TEMPEST peers nodes.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `system` | `string` | Optional | Exact ARGUS system filter. |
| `subsystem` | `string` | Optional | Exact ARGUS subsystem filter. |
| `type` | `string` | Optional | Exact event-type filter. |
| `status` | `string` | Optional | Exact event-status filter. |
| `node` | `string` | Optional | Exact originating-node filter. |
| `channel` | `string` | Optional | Exact related-channel filter. |
| `text` | `string` | Optional | Free-text filter. `query` is accepted as an alias. |
| `query` | `string` | Optional | Alias for `text`. |
| `session_id` | `string` | Optional | Exact ARGUS session filter. |
| `from_ns` | `integer` | Optional | Inclusive lower timestamp bound in Unix-epoch nanoseconds; zero disables the bound. |
| `to_ns` | `integer` | Optional | Inclusive upper timestamp bound in Unix-epoch nanoseconds; zero disables the bound. |
| `limit` | `integer` | Optional | Maximum event count; defaults to 500 and is clamped to at most 2000 when merging nodes. |
| `offset` | `integer` | Optional | Zero-based result offset; defaults to 0. |
| `active_only` | `boolean` | Optional | Restrict results to active events; defaults to false. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `events` | `array<ArgusEvent>` | Matching events ordered by the ARGUS store. |
| `count` | `integer` | Number of events in this page. |
| `total_count` | `integer` | Total number of matching events before pagination. |
