---
title: dartwic/schematic-nodes-query
summary: Queries registered schematic node definitions.
created: 2026-08-03T16:00
updated: 2026-11-05T20:29
---

- **Category:** Schematics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive text used to filter registered node definitions; defaults to empty. |
| `include_project_paths` | `boolean` | Optional | Wrap the catalog with workspace-relative paths for project-owned definitions; defaults to false. |

## Response payload

**object:** Matching definitions grouped by category and display name. When include_project_paths is true, returns `nodes` with that catalog, `project_paths` with paths keyed by category and name, and `includes_project_paths: true`.
