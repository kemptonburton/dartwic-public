---
title: project/actions/create
summary: Creates a reviewed project operation.
created: 2026-10-04T18:31
updated: 2026-10-20T16:11
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `kind` | `string` | Required | rename_channel, delete_channels, delete_task, delete_tasks, or delete_module. |
| `channel_names` | `array<string>` | Optional | Selected local channels. |
| `task_name` | `string` | Optional | Task to delete. |
| `task_names` | `array<string>` | Optional | Tasks to delete together. |
| `module_name` | `string` | Optional | Module to delete together with its linked tasks and owned channels. |
| `new_name` | `string` | Optional | Destination for a channel rename. |

## Response payload

**object:** Reviewed action and impact report. Resource deletions enumerate stops, task removals, owned-channel removals, module removal, and snapshot persistence; referenced-only channels remain review evidence.
