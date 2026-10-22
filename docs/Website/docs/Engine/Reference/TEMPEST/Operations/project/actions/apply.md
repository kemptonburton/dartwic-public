---
title: project/actions/apply
summary: Applies a reviewed action after checking its current project revision.
created: 2026-10-04T18:31
updated: 2026-10-15T18:58
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Project action identifier. |
| `revision` | `string` | Required | Revision that the operator reviewed. |
| `take_manual_control` | `boolean` | Optional | Use authenticated operator manual authority for deletion; fixed removal invalidates retained handles through normal generation checks. |

## Response payload

**object:** Applied project action result.
