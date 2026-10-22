---
title: dartwic/projects/rename
summary: Renames an existing project.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `project_name` | `string` | Optional | Current project name. Supply this or `current_name`. |
| `next_name` | `string` | Optional | New project name. Supply this or `new_name`. |
| `current_name` | `string` | Optional | Backward-compatible alias for `project_name`. |
| `new_name` | `string` | Optional | Backward-compatible alias for `next_name`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `restart_requested` | `boolean` | Whether renaming the active project queued an engine restart. |
| `previous_project_name` | `string` | Sanitized previous name. |
| `next_project_name` | `string` | Sanitized new name. |
| `active_project` | `Project` | Active project at response time. |
| `projects` | `array<Project>` | Project list at response time. |

## Errors

- Required names are missing, the source is missing, another project has the destination name ignoring case, or the filesystem rejects the rename.
