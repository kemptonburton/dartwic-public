---
title: dartwic/get-file
summary: Reads a text file and optionally creates it when missing.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | Required | Logical workspace root name or explicit filesystem path. |
| `filePath` | `string` | Required | File path below `rootDir`. |
| `create_if_not_found` | `boolean` | Optional | Create the file when it does not exist; defaults to false. |
| `initial_content` | `string` | Optional | Initial text written only when creating a missing file; defaults to an empty string. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `content` | `string` | Complete text read from the file. |

## Errors

- The file is missing and creation was not requested, or the file cannot be created or opened.
