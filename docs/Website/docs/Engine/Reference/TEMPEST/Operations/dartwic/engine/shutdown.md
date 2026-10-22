---
title: dartwic/engine/shutdown
summary: Requests a graceful engine shutdown without restarting it.
created: 2026-09-04T17:13
updated: 2026-10-20T18:59
---

- **Category:** Engine Runtime

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `reason` | `string` | Optional | Human-readable shutdown reason; defaults to `Engine shutdown requested`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `shutdown_requested` | `boolean` | Always true on success. |
| `project_name` | `string` | Project active when shutdown was requested. |
| `reason` | `string` | Shutdown reason supplied by the client. |
