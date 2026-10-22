---
title: rapid/dataframes/list
summary: Lists managed test dataframes. Pages are ordered by start time, then ID. Overview mode covers the full requested range without returning full frame records.
created: 2026-10-04T18:31
updated: 2026-10-21T00:09
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `mode` | `string` | Optional | Use `overview` for complete range presence; omit for metadata pages or the legacy full list. |
| `from_ns` | `integer` | Optional | Include frames overlapping this UTC nanosecond lower bound; omit for all history. |
| `to_ns` | `integer` | Optional | Include frames overlapping this UTC nanosecond upper bound; omit for all history. |
| `offset` | `integer` | Optional | Zero-based page offset; supplying any paging or range argument enables paging. |
| `seek_ns` | `integer` | Optional | When offset is omitted, center the first page near this UTC nanosecond time. |
| `limit` | `integer` | Optional | Page size from 1 to 200; defaults to 100 when paging is enabled. |
| `query` | `string` | Optional | Case-insensitive dataframe name or explicitly selected channel filter for paged results. |
| `bucket_count` | `integer` | Optional | Overview fallback resolution from 1 to 1000; defaults to 500. |
| `detail_limit` | `integer` | Optional | Maximum overview entries with individual IDs and names from 1 to 2000; defaults to 1000. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `frames` | `array<object>` | Full frame records for pages, or compact ID/name/time summaries in overview mode up to detail_limit; empty for bucket fallback. |
| `buckets` | `array<object>` | Overview occupancy intervals with from_ns, to_ns and count when the match count exceeds detail_limit. |
| `from_ns` | `integer` | Requested overview start in UTC nanoseconds. |
| `to_ns` | `integer` | Requested overview end in UTC nanoseconds. |
| `total` | `integer` | Matching frame count for a paged request. |
| `offset` | `integer` | First returned frame's index among matches. |
| `has_previous` | `boolean` | Whether an earlier page exists. |
| `has_more` | `boolean` | Whether the paged result has another page. |
| `next_offset` | `integer` | Offset for the next page. |
| `complete_from_ns` | `integer` | Lower display boundary for this page's loaded-time indicator. |
| `complete_through_ns` | `integer` | Upper display boundary before the next page's first start, or the requested end; this is a display hint, not proof that earlier overlapping frames were loaded. |
