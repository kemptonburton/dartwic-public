---
title: dartwic/modules/reload-module-instance/start
summary: Starts a detached job that reloads a module instance.
created: 2026-08-04T17:05
updated: 2026-10-20T18:59
---

- **Category:** Modules

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `instanceName` | `string` | Required | Name of the configured module instance to reload. |

## Response payload

**DetachedJob:** A detached-job descriptor. Its completed `result.message` confirms that the module was reloaded.
