---
title: dartwic/search-schematic-node-instances
summary: Searches schematic node instances.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Schematics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive text used to search saved schematic node instances; defaults to empty. |
| `limit` | `integer` | Optional | Maximum result count; defaults to 12. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `results` | `array<SchematicNodeInstance>` | Matching node instances with their schematic location and node data. |
