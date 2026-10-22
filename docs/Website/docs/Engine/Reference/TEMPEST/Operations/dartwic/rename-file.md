---
title: dartwic/rename-file
summary: Renames a file or directory without changing its parent directory.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | Required | Logical workspace root name or explicit filesystem path. |
| `path` | `string` | Required | Path to the existing file or directory below `rootDir`. |
| `newName` | `string` | Required | New base name. For files, the existing extension is retained automatically. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message (`File renamed`). |
