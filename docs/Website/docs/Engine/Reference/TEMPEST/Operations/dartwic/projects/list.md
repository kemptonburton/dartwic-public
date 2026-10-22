---
title: dartwic/projects/list
summary: Lists available projects.
created: 2026-08-03T16:00
updated: 2026-10-22T02:44
---

- **Category:** Projects and Files

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `workspace_root_directory` | `string` | Absolute workspace root directory. |
| `workspace_assets_directory` | `string` | Absolute shared authored assets directory; never a project. |
| `active_project` | `Project` | Active project `name` and absolute `path`. |
| `projects` | `array<Project>` | Available projects, each with `name`, `path`, and `is_active`. |
