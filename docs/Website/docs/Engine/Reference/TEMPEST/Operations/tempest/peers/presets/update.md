---
title: tempest/peers/presets/update
summary: Atomically creates, edits, or removes one shared command preset.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `action` | `string` | Required | `upsert` or `remove`. |
| `peer_id` | `string` | Required | Registered peer definition ID. |
| `node` | `string` | Required | Stable peer node name. |
| `id` | `string` | Required | Unique preset ID. |
| `kind` | `string` | Optional | Must be `command` when present. |
| `label` | `string` | Optional | Display label for upsert. |
| `operation` | `string` | Optional | Callable operation for upsert. |
| `arguments` | `object` | Optional | Arguments for upsert. |
| `secret_fields` | `array<string>` | Optional | JSON pointers under /arguments/ for private values. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `updated` | `boolean` | Whether a preset was changed. |
