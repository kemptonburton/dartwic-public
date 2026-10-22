---
title: dartwic/remove-task
summary: Removes task.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `task_name` | `string` | Required | Task to remove. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message (`Task removed.`). |
| `retired_channels` | `array<string>` | Fixed channels removed with the task. |
| `retained_channels` | `array<string>` | Channels retained after task removal. |
