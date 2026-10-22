---
title: dartwic/modules/build-module-instance
summary: Builds a module instance configuration without loading it.
created: 2026-08-03T16:00
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

| Field | Type | Description |
| --- | --- | --- |
| `module_instance` | `object` | Generated module-instance configuration. |
| `content` | `string` | Pretty-printed JSON representation of `module_instance`, terminated by a newline. |
