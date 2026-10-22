---
title: project/actions/update
summary: Rechecks a project action and optionally changes its rename destination.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Project action identifier. |
| `new_name` | `string` | Optional | Rename destination. |

## Response payload

**object:** Rechecked project action and impact report.
