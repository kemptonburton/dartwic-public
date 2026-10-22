---
title: rapid/history/channels
summary: Queries channel history summaries in a detached job.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `from_ns` | `integer` | Optional | Start of the time range. |
| `to_ns` | `integer` | Optional | End of the time range. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `job_id` | `string` | Detached job identifier. |
