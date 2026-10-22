---
title: rapid/dataframes/statistics-start
summary: Counts a saved dataframe and estimates logical recording payload size without reading channel sample values or formatting an export.
created: 2026-10-21T00:08
updated: 2026-10-21T00:44
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Saved dataframe identifier; an active frame's end is frozen when its job begins. |
| `channels` | `array<string>` | Optional | Optional channel subset within the saved view. |
| `include_channels` | `boolean` | Optional | Include channel datapoints; defaults to true. |
| `include_events` | `boolean` | Optional | Include configured events and occurrences; defaults to true. |
| `include_logs` | `boolean` | Optional | Include configured logs; defaults to true. |

## Response payload

**DetachedJob:** Cancellable client-owned historical query. Progress result.statistics has null counters until each component is counted; completion returns counts and estimated component bytes/data_bytes with size_is_estimate=true and size_basis=logical_record_payload_estimate. Channels use 24 bytes per recorded row; event/log payloads use field byte lengths and fixed-width scalar sizes. This excludes dictionaries, database/index/container overhead and compression, and is not CSV/JSONL or exclusive on-disk size. Shared records count in every matching frame.

## Errors

- Unknown dataframe, invalid subset, unavailable history, or cancellation. Uses existing range aggregates for channels and bounded event/log visitors; no sample-value materialization or export formatting.
