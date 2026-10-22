---
title: dartwic/modules/build-module-instance/start
summary: Starts a detached job that builds a module instance configuration.
created: 2026-08-04T17:05
updated: 2026-10-20T18:59
---

- **Category:** Modules

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `instanceName` | `string` | Optional | Module-instance name. `instance_name` is accepted as an alias. |
| `pluginId` | `string` | Optional | Engine plugin ID that owns the module type. `plugin_id` is accepted as an alias. |
| `moduleTypeId` | `string` | Optional | Module type to instantiate. `module_type_id` is accepted as an alias. |

## Response payload

**DetachedJob:** A detached-job descriptor. Its completed `result` contains `module_instance` and its pretty-printed `content`.
