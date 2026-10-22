---
title: dartwic/engine/restart
summary: Requests an engine restart.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Engine Runtime

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `reason` | `string` | Optional | Human-readable restart reason; defaults to `Engine restart requested`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `restart_requested` | `boolean` | Always true on success. |
| `project_name` | `string` | Project active when the restart was requested. |
| `reason` | `string` | Restart reason sent to clients. |
