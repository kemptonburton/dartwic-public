---
title: rapid/history/resume
summary: Resumes reclamation for a stored cleanup operation.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `operation_id` | `string` | Required | Cleanup operation identifier. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `job_id` | `string` | Detached job identifier. |
