---
title: dartwic/projects/select
summary: Selects the active project loaded by the engine.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `project_name` | `string` | Optional | Project to activate. Supply this or `name`. |
| `name` | `string` | Optional | Backward-compatible alias for `project_name`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `restart_requested` | `boolean` | Always true on success because selection takes effect through an engine restart. |
| `active_project` | `Project` | Newly selected project `name` and absolute `path`. |
| `projects` | `array<Project>` | Updated project list. |

## Errors

- The name is empty or the project does not exist.
