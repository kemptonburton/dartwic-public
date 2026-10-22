---
title: dartwic/abort-timeline
summary: Aborts a running timeline and executes only its explicit abort handlers.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `task_name` | `string` | Required | Timeline task to abort. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message. |
