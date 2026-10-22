---
title: dartwic/delete-file
summary: Deletes one file or one empty directory.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | Required | Logical workspace root name or explicit filesystem path. |
| `path` | `string` | Required | File or empty-directory path below `rootDir`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message (`File deleted`). |

## Errors

- The path does not exist or cannot be removed.
