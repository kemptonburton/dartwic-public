---
title: dartwic/delete-file
summary: Deletes one file, one empty directory, or a resource group containing only its own file and empty nested directories.
created: 2026-08-03T16:00
updated: 2026-10-25T22:21
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | Required | Logical workspace root name or explicit filesystem path. |
| `path` | `string` | Required | File, empty-directory, or resource-group path below `rootDir`. |
| `groupFile` | `string` | Optional | For a resource group under `projects_directory`, the name of its own file. The group is removed only when its other entries are empty directories. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Confirmation after synchronous filesystem removal (`File deleted` or `Resource group deleted`). |

## Errors

- The path does not exist, a directory is not empty, a group contains another file or link, or removal fails.
