---
title: rapid/history/delete-start
summary: Applies a reviewed history cleanup preview.
created: 2026-10-04T18:31
updated: 2026-10-14T22:39
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `preview_id` | `string` | Required | Preview identifier owned by this client. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `job_id` | `string` | Detached job identifier. |
