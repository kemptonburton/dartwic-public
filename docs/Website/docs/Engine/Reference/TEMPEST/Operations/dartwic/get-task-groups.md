---
title: dartwic/get-task-groups
summary: Lists configured task groups registered with CAESAR.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive text used to filter the task-group list. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `task_groups` | `array<TaskGroup>` | Matching task-group configurations. Each member includes its last due-release outcome: `completed`, `callback_failed`, `skipped_stopped`, `not_dispatched`, or `not_yet_released`. Ordered members can continue after an earlier callback failure; inspect this outcome rather than treating order as proof of a successful previous step. |
| `query` | `string` | The applied search query. |
