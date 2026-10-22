---
title: dartwic/search-files/start
summary: Starts a detached job that searches project files.
created: 2026-08-04T17:05
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive search text. An empty query returns no results. |
| `limit` | `integer` | Optional | Maximum result count; defaults to 30 and is clamped to at least 1. |
| `include_content` | `boolean` | Optional | Whether to search files smaller than 1 MiB for matching text; defaults to true. |
| `content_only` | `boolean` | Optional | Whether to skip file-name and path matching; defaults to false. |
| `roots` | `array<string>` | Optional | Project-relative directories to search; defaults to the active project root. |
| `allowed_extensions` | `array<string>` | Optional | File extensions to include, with or without a leading dot; an empty list allows all extensions. |
| `excluded_file_names` | `array<string>` | Optional | Exact file names to omit. |
| `excluded_paths` | `array<string>` | Optional | Project-relative path prefixes to omit. |

## Response payload

**DetachedJob:** A detached-job descriptor. Its completed `result` contains the search `query` and ranked `results`.
