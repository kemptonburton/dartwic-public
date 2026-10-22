---
title: dartwic/modules/provision-discovery-request
summary: Provisions the module and linked tasks selected in the built-in module-discovery UI.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Plugins and Modules

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `request_id` | `string` | Required | Pending dartwic.module-discovery request. |
| `plan` | `object` | Required | module contains instance_name, module_type, and optional parameters; optional tasks contains up to 128 task_name/task_type entries with metadata and arguments. The engine sets module_instance_name on each task. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `outcome` | `string` | created after successful provisioning. |
| `creation_plan` | `object` | Submitted module and task plan. |
| `module_instance` | `string` | Created module instance name. |
| `tasks` | `array<string>` | Created task names. |
| `binding_impact` | `object` | Channel binding changes caused by provisioning. |

## Errors

- The request, plan, module or task identity, registered type, or capacity is invalid; creation failure triggers rollback.
