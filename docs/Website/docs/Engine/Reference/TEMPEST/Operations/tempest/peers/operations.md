---
title: tempest/peers/operations
summary: Lists the selected node's currently callable operations, including the current engine.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node` | `string` | Required | Current engine or connected peer node name. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `operations` | `array<object>` | Registered operation descriptors. |
