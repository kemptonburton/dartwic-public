---
title: tempest/peers/presets/run
summary: Calls a saved pinned operation on the current engine or a connected peer. Overrides merge with saved arguments.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node` | `string` | Required | Current engine or connected remote node name. |
| `preset` | `string` | Required | Stable pin ID or unambiguous label on that node. |
| `overrides` | `object` | Optional | Argument values overriding the saved operation. |

## Response payload

**object:** Operation result.

## Errors

- Missing or ambiguous pin, local handler failure, disconnected peer, timeout, or remote rejection. A remote timeout means unknown completion; the operation is not retried.
