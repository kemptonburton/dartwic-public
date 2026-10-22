---
title: dartwic/modules/reload-module-instance
summary: Reloads a configured module instance.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Modules

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `instanceName` | `string` | Required | Name of the configured module instance to reload. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message (`Module successfully reloaded`). |
