---
title: dartwic/set-timeline-time
summary: Applies a previously previewed timeline clock change with explicit per-bucket decisions.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `task_name` | `string` | Required | Timeline task to edit. |
| `mission_time` | `number` | Required | Exact target returned by preview-timeline-time. |
| `revision` | `number` | Required | Revision returned by preview-timeline-time. |
| `decisions` | `object` | Required | Bucket identity to execute/skip or rearm/keep. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Apply status; the timeline remains held. |
| `revision` | `integer` | Revision after applying the clock change. |
| `mission_time` | `number` | Applied signed mission time in seconds. |
| `effective_t0` | `number` | Effective T0 in Unix seconds. |
| `crossed_buckets` | `array<object>` | Buckets considered by the clock change. |
