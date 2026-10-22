---
title: rapid/query-channel-range
summary: Queries channel range.
created: 2026-08-03T16:00
updated: 2026-10-14T22:39
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `series` | `array<string>` | Required | Channel keys or channel-field paths to query; at least one and no more than the server series limit. |
| `from` | `integer` | Optional | Inclusive Unix-epoch start time. Millisecond, microsecond, and nanosecond values are normalized by magnitude; `x_from` is an alias. |
| `x_from` | `integer` | Optional | Alias for `from`. |
| `to` | `integer` | Optional | Inclusive Unix-epoch end time. Millisecond, microsecond, and nanosecond values are normalized by magnitude; `x_to` is an alias. |
| `x_to` | `integer` | Optional | Alias for `to`. |
| `bucket_count` | `integer` | Optional | Requested downsample bucket count. Zero or omission returns raw points subject to server limits. |
| `bucket_mode` | `string` | Optional | Downsampling mode: `average` (default) or `extrema`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channels` | `array<ChannelSeries>` | One item per requested series with `channel_reference`, raw/returned point counts, and `{timestamp, value}` points. |
| `bucket_count` | `integer\|null` | Effective bucket count, or null for an unbucketed query. |
| `bucket_mode` | `string\|null` | Effective bucket mode, or null for an unbucketed query. |
| `bucketed` | `boolean` | Whether downsampling was applied. |
| `total_raw_points` | `integer` | Total points before downsampling. |
| `total_points` | `integer` | Total points returned. |
| `total_point_limit` | `integer` | Server-wide point limit for one response. |
| `query_seconds` | `number` | Server query duration in seconds. |

## Errors

- The series list is missing/too large, the request exceeds raw-point limits, a channel is invalid, or the query is canceled.
