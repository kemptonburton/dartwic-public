---
title: dartwic/settings/configure
summary: Writes workspace/project overrides, or resets JSON pointers to inheritance.
created: 2026-10-20T18:59
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `scope` | `string` | Optional | workspace (default) or project. |
| `patch` | `object` | Optional | Intentional overrides; objects merge and arrays replace. |
| `reset` | `array<string>` | Optional | JSON pointers to remove from this scope. |
| `project` | `string` | Optional | Project name; omitted selects the active project. |
| `revision` | `string` | Optional | Reject a stale edit when supplied. |

## Response payload

**object:** Updated settings snapshot; caller defaults must be supplied on the next read.
