---
title: dartwic/reset-timeline
summary: Resets a stopped timeline to its configured clock and clears its bucket ledger.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `task_name` | `string` | Required | Stopped timeline task to reset. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message. |
