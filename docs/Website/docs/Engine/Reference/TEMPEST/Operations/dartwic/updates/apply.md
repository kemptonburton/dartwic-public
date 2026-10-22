---
title: dartwic/updates/apply
summary: Applies a previously staged engine update using the external recovery helper and shuts down this process.
created: 2026-09-04T17:13
updated: 2026-10-20T18:59
---

- **Category:** Engine Updates

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `stage_id` | `string` | Required | Identifier returned by the staging operation. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `state` | `string` | Applying when the helper was launched. |
