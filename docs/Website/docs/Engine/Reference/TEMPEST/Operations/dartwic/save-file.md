---
title: dartwic/save-file
summary: Writes a file or creates a directory below a workspace root.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | Required | Logical workspace root name or explicit filesystem path. |
| `path` | `string` | Required | Destination path. A trailing slash or final segment without an extension is treated as a directory. |
| `content` | `string` | Optional | Complete file content; defaults to an empty string and is ignored for directories. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | `File saved` or `Directory created`. |

## Errors

- The destination cannot be opened for writing.
