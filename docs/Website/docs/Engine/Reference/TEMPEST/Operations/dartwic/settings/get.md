---
title: dartwic/settings/get
summary: Reads portable policy and its source scopes.
created: 2026-10-20T18:59
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `defaults` | `object` | Optional | Caller defaults overlaid by workspace and project policy. |
| `project` | `string` | Optional | Project name; omitted selects the active project. |

## Response payload

**object:** Effective settings, workspace/project documents, leaf source scopes and an opaque revision token.
