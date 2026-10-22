---
title: dartwic/watch-runtime-loops
summary: Begins a live runtime-loop feed and returns its initial filtered snapshot.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `watch_id` | `string` | Required | Unique identifier for this view. |
| `query` | `string` | Optional | Loop search text. |
| `names` | `array<string>` | Optional | Exact loop names to follow; omitted follows every matching loop, an empty array follows none, and more than 512 names is rejected. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `watch_id` | `string` | Active watch ID. |
| `loops` | `array<RuntimeLoop>` | Initial matching loops. |
| `revision` | `integer` | Watch revision. |
