---
title: tempest/peers/presets/list
summary: Lists shared command presets for one stable peer identity.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `peer_id` | `string` | Required | Registered peer definition ID. |
| `node` | `string` | Required | Stable peer node name. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `presets` | `array<object>` | Shared pinned operation presets. |
