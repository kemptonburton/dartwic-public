---
title: dartwic/projects/switching
summary: Announces that a project change has requested an engine restart.
created: 2026-08-04T16:30
updated: 2026-10-04T21:09
---

- **Category:** Projects
- **Direction:** Server → clients

## Delivery

Published immediately before shutdown is requested for project selection or active-project rename.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `project_name` | `string` | Always | Project active before the restart completes. |
| `previous_project_name` | `string` | Conditional | Sanitized previous name when the active project is being renamed. |
| `next_project_name` | `string` | Conditional | Sanitized replacement name when the active project is being renamed. |
| `phase` | `string` | Always | Restart phase; initially `restart_requested`. |
| `reason` | `string` | Always | Human-readable reason for the project restart. |
