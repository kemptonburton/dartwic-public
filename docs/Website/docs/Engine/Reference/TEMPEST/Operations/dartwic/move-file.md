---
title: dartwic/move-file
summary: Moves a file or directory to a new path within the selected root.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | Required | Logical workspace root name or explicit filesystem path. |
| `sourcePath` | `string` | Required | Existing path below `rootDir`. |
| `destinationPath` | `string` | Required | New path below `rootDir`; missing parent directories are created. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation message (`File moved`). |

## Errors

- The source does not exist or the destination already exists.
