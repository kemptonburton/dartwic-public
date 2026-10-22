---
title: argus/history
summary: Queries event occurrence overlap and chronological log history.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `from_ns` | `integer` | Required | Start time in UTC nanoseconds. |
| `to_ns` | `integer` | Required | End time in UTC nanoseconds. |
| `frame_id` | `string` | Optional | Restrict results to a saved dataframe view. |
| `mode` | `string` | Optional | timeline, details, occurrences, or availability. |
| `event_id` | `string` | Optional | Logical event for an occurrences page. |
| `kind` | `string` | Optional | events or logs; omitted includes both. |
| `limit` | `integer` | Optional | Details page size, up to 1000. |
| `offset` | `integer` | Optional | Event page offset. |
| `cursor` | `array` | Optional | Opaque log continuation cursor. |
| `bucket_bounds_ns` | `array<integer>` | Optional | Explicit local-day boundaries for calendar availability. |

## Response payload

**object:** Event and log pages or counts per time bucket; occurrence mode returns one event's bounded interval page.
