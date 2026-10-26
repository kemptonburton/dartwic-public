---
title: project/actions/apply
summary: Applies an action with refreshed evidence, serializing it behind active actions.
created: 2026-10-04T18:31
updated: 2026-10-24T21:02
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Project action identifier. |
| `revision` | `string` | Required | Last displayed revision; current evidence is refreshed automatically when execution starts. |
| `take_manual_control` | `boolean` | Optional | Defaults to true: use authenticated operator authority for action stops and channel changes. Explicit false retains ordinary authority checks. Fixed retirement invalidates retained handles normally. |

## Response payload

**object:** Applied project action result.
