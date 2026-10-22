---
title: dartwic/get-task-types
summary: Returns task types.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `task_types` | `array<TaskType>` | Registered task types with ID, display name, runtime structure, icon, provider, expected plugin ID, and default arguments. |
