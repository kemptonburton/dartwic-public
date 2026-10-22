---
title: rapid/dataframes/export-start
summary: Starts a cancellable ZIP export of a dataframe's selected records.
created: 2026-10-04T18:31
updated: 2026-10-21T00:27
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Dataframe identifier. |
| `channels` | `array<string>` | Optional | Selected channel subset; omitted includes all. |
| `include_channels` | `boolean` | Optional | Include raw channel CSV; defaults to true. |
| `include_events` | `boolean` | Optional | Include event history; defaults to true. |
| `include_logs` | `boolean` | Optional | Include log history; defaults to true. |

## Response payload

**DetachedJob:** Client-owned job canceled on disconnect. progress_rows/total_rows reports estimated preparation work out of 10000 units across counting (5%), channel records (75%), events (5%), logs (5%) and archive packaging (10%); this excludes HTTP download and is not elapsed-time progress. Progress result.statistics reports channel_count, channels_counted, datapoint_count, datapoint_total, log_count, event_count, occurrence_count and data_bytes; completion includes the final statistics, ZIP file_bytes and download_url. data_bytes measures canonical uncompressed record payloads, excluding headers, manifest, archive and database/index overhead. Datapoint totals are measured before scanning and may differ if retention or an overlapping deletion changes history during export.
