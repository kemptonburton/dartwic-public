---
title: argus/query-events/start
summary: Starts a detached ARGUS event query job.
created: 2026-08-04T17:05
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
| `node` | `string` | Optional | Exact originating-node filter. |
| `channel` | `string` | Optional | Exact related-channel filter. |
| `text` | `string` | Optional | Free-text filter. `query` is accepted as an alias. |
| `query` | `string` | Optional | Alias for `text`. |
| `session_id` | `string` | Optional | Exact ARGUS session filter. |
| `from_ns` | `integer` | Optional | Inclusive lower timestamp bound in Unix-epoch nanoseconds; zero disables the bound. |
| `to_ns` | `integer` | Optional | Inclusive upper timestamp bound in Unix-epoch nanoseconds; zero disables the bound. |
| `limit` | `integer` | Optional | Maximum event count; defaults to 500 and is clamped to at most 2000 when merging nodes. |
| `offset` | `integer` | Optional | Zero-based result offset; defaults to 0. |
| `paged` | `boolean` | Optional | Preserve concurrent page-query jobs; defaults to false. |
| `active_only` | `boolean` | Optional | Restrict results to active events; defaults to false. |

## Response payload

**DetachedJob:** A detached-job descriptor. Its completed `result` contains `events`, page `count`, and `total_count`, merged across local and connected remote engines when appropriate.
