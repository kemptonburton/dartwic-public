---
title: rapid/audit-channel-impact
summary: |-
  Audits channel ownership and project references before a channel, task,
  or module change. Runtime-computed plugin names are reported as a limit
  of the scan rather than treated as proof that a channel is unused.
created: 2026-10-04T18:31
updated: 2026-10-04T21:19
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_names` | `array<string>` | Optional | Local channels to inspect. |
| `task_name` | `string` | Optional | Include channels declared or created by this task. |
| `module_name` | `string` | Optional | Include channels created by this module. |
| `orphan_candidates` | `boolean` | Optional | Include fixed channels whose recorded task or module no longer exists. |
| `ownership_only` | `boolean` | Optional | Read current runtime ownership for browsing, omitting project-reference scanning and deletion decisions. |

## Response payload

**object:** Channel impact report and project references.
