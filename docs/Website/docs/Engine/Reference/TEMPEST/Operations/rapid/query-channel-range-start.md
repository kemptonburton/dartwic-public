---
title: rapid/query-channel-range-start
summary: Starts a cancellable, low-priority historical graph query job.
created: 2026-08-04T16:41
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
| `bucket_count` | `integer` | Required | Positive downsample bucket count; required for this historical graph job. |
| `bucket_mode` | `string` | Required | Must be `extrema` for this historical graph job. |
| `request_key` | `string` | Optional | Client-defined key used to cancel and replace an older graph job; defaults to `default` and is truncated to 128 characters. |

## Response payload

**DetachedJob:** A detached-job descriptor. The job requires `bucket_count > 0` with `bucket_mode` set to `extrema`; its completed `result` has the same channel-series contract as `rapid/query-channel-range`.
