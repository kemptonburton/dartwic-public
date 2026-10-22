---
title: rapid/history/configure-retention
summary: Saves automatic retention policy with nonnegative limits.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | Optional | Enable automatic cleanup. |
| `scope` | `string` | Optional | workspace (default) or project. |
| `channels` | `object` | Optional | Changed channel retention days and bytes. |
| `events` | `object` | Optional | Changed event retention days and bytes. |
| `logs` | `object` | Optional | Changed log retention days and bytes. |

## Response payload

**object:** Saved retention settings.
