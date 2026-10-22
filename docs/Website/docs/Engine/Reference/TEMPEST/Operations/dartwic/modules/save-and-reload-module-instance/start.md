---
title: dartwic/modules/save-and-reload-module-instance/start
summary: Starts a detached job that saves and reloads a module instance.
created: 2026-08-04T17:05
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

**DetachedJob:** A detached-job descriptor. Its completed `result` contains `message`, `instanceName`, and `path`.
