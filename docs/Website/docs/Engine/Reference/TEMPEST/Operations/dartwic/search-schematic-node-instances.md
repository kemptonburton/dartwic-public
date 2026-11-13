---
title: dartwic/search-schematic-node-instances
summary: |-
  Searches nodes in the active project's schematics, including nested folders.
  Reconciles the cached index before returning. Empty queries return the first nodes.
  Unreadable or malformed files are reported without hiding valid matches.
created: 2026-08-03T16:00
updated: 2026-11-13T00:56
---

- **Category:** Schematics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive text used to search saved schematic node instances; defaults to empty. |
| `limit` | `integer` | Optional | Maximum result count, clamped to 1–200; defaults to 12. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `results` | `array<SchematicNodeInstance>` | Matching node instances with their schematic location and node data. Portal entries include connected_edges with owning edge appearance and branch connections for previews. |
| `failures` | `array<object>` | Files omitted from an incomplete index, with resource_path and error. |
