---
title: dartwic/create-task
summary: Creates task.
created: 2026-08-03T16:00
updated: 2026-10-25T12:50
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `task_name` | `string` | Required | Flat task name; generated channels use this name as their prefix. |
| `task_type` | `string` | Required | Registered task-type ID. |
| `metadata` | `object` | Optional | Task metadata; defaults to an empty object. |
| `arguments` | `object` | Optional | Task arguments; defaults to an empty object. Plugin task types may accept `module_instance_name`. |
| `expected_arguments` | `object` | Optional | Optional optimistic concurrency check against the current arguments; conflicts reject before reconfiguration. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message (`Task created.`). |
| `builder_session_id` | `string` | Builder session that records configuration and binding work. |
| `channel_changes` | `array<ChannelStorageChange>` | Fixed-channel storage changes caused by the task configuration. |
| `binding_impact` | `object` | Active DCode bindings affected and rebound after channel-layout changes. |

## Errors

- The task type or arguments are invalid, a referenced module instance is missing/incompatible, or the license task limit is exceeded.
