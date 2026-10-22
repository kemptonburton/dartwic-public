---
title: dartwic/preview-timeline-time
summary: Holds a running timeline and previews the buckets crossed by a clock change.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `task_name` | `string` | Required | Timeline task to preview. |
| `mission_time` | `number` | Optional | New signed mission time in seconds. |
| `shift_seconds` | `number` | Optional | Delta applied to the current mission time. |
| `t0_unix` | `number` | Optional | Absolute T0 expressed as Unix seconds. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Preview status; the timeline is held. |
| `revision` | `integer` | Preview revision required when applying the change. |
| `direction` | `string` | forward, backward, or unchanged. |
| `current_mission_time` | `number` | Current signed mission time in seconds. |
| `target_mission_time` | `number` | Resolved target to submit as mission_time when applying. |
| `effective_t0` | `number` | Effective T0 in Unix seconds. |
| `crossed_buckets` | `array<object>` | Crossed timeline buckets requiring explicit decisions. |
