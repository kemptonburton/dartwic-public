---
title: dartwic/modules/save-and-reload-module-instance
summary: Saves and reloads a module instance.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Modules

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `path` | `string` | Required | Destination module-instance configuration path. |
| `rootDir` | `string` | Optional | Logical workspace root name or explicit path; defaults to `projects_directory`. |
| `content` | `string` | Optional | Complete JSON configuration text; defaults to an empty string. |
| `instanceName` | `string` | Optional | Instance to reload. When omitted, it is read from the configuration's non-empty string `name` field. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message (`Module instance saved and reloaded`). |
| `instanceName` | `string` | Module instance that was reloaded. |
| `path` | `string` | Saved path as supplied by the client. |

## Errors

- The path is empty, the file cannot be written, the JSON is invalid, no instance name can be resolved, or reload fails.
