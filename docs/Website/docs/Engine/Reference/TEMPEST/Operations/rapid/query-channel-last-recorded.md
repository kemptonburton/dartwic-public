---
title: rapid/query-channel-last-recorded
summary: Queries channel last recorded.
created: 2026-09-04T17:13
updated: 2026-10-14T22:39
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `series` | `array<string>` | Required | Channel keys or channel-field paths whose latest persisted point should be returned. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channels` | `array<LastRecordedSeries>` | One item per requested series with `channel_reference` and either a `{timestamp, value}` point or null. |
| `persistence_diagnostics` | `object` | Current persistence health and writer statistics. publication_queue_depth and publication_queue_capacity count asynchronous notifications; publication_queued_fixed_writes and publication_fixed_write_capacity count compact numeric fixed writes. publication_overwritten_total counts oldest whole notifications lost when either queue limit fills; live values and synchronous calculations are unchanged. Includes recording_queue_rows, recording_queue_bytes, recording_queue_row_capacity, recording_queue_byte_capacity, and recording_dropped_rows_total for bounded ingress. Oldest pending data is dropped on overflow; oversized blocks or blocks without retirement capacity are rejected before payload construction. recording_retired_rows, recording_retired_bytes, recording_retired_row_capacity, and recording_retired_byte_capacity describe discarded bulk payloads awaiting background cleanup. RapidLog index_queue_rows, index_queue_bytes, index_queue_row_capacity, and index_queue_byte_capacity describe the separate bounded index handoff, which blocks background writers instead of dropping disk-written rows. Active writer/index/reclamation batches and historical indexes are separate. |
