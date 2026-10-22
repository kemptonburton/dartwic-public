---
title: dartwic/get-directory-tree
summary: Returns a recursive directory tree rooted at a workspace resource directory.
created: 2026-08-03T16:00
updated: 2026-10-22T02:44
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `rootDir` | `string` | Required | Logical root name (`projects_directory`, `workspace_assets_directory`, or `workspace_directory`) or an explicit filesystem path. |
| `directoryPath` | `string` | Required | Path below `rootDir`; use an empty string to read the root itself. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `files` | `array<object>` | Files directly in the requested directory. Each item contains the file `name` and a `path` relative to the requested root. |
| `directories` | `object<string, DirectoryTree>` | Child directories keyed by name. Each child recursively contains `files` and `directories`. |

## Errors

- The resolved root does not exist or is not a directory.
