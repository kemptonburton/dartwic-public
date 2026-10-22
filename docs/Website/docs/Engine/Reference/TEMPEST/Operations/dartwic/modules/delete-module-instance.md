---
title: dartwic/modules/delete-module-instance
summary: Deletes a configured module instance.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Modules

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `instanceName` | `string` | Required | Name of the configured module instance to delete. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message (`Module deleted`). |
| `retired_channels` | `array<string>` | Fixed channels removed with the module. |
| `retained_channels` | `array<string>` | Channels retained after module removal. |
