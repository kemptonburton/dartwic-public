---
title: dartwic/projects/list
summary: Lists available projects.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `workspace_root_directory` | `string` | Absolute workspace root directory. |
| `global_data_directory` | `string` | Absolute global-data directory. |
| `active_project` | `Project` | Active project `name` and absolute `path`. |
| `projects` | `array<Project>` | Available projects, each with `name`, `path`, and `is_active`. |
