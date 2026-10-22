---
title: dartwic/get-module-instances
summary: Returns module instances.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Modules

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `plugin_id` | `string` | Optional | Optional engine-plugin ID used to filter instances. |
| `pluginId` | `string` | Optional | Legacy alias for `plugin_id`. |
| `registry_name` | `string` | Optional | Legacy alias for `plugin_id`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `module_instances` | `array<ModuleInstanceSummary>` | Instances with `name`, `plugin_id`, `module_type_id`, and resolvable `resource_path`. |
