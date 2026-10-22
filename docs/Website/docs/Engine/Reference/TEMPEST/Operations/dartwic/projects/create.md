---
title: dartwic/projects/create
summary: Creates a project and makes it available to the engine.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `project_name` | `string` | Optional | Name of the project to create. Supply this or `name`. |
| `name` | `string` | Optional | Backward-compatible alias for `project_name`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `created_project` | `Project` | Created project `name` and absolute `path`. |
| `active_project` | `Project` | Currently active project; project creation does not automatically select it. |
| `projects` | `array<Project>` | Updated project list. |

## Errors

- The name is empty or reserved, or another project has the same name ignoring case, or the project cannot be created.
