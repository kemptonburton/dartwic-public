---
title: dartwic/schematic-nodes-query
summary: Queries registered schematic node definitions.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Schematics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive text used to filter registered node definitions; defaults to empty. |

## Response payload

**object<string, object<string, SchematicNodeDefinition>>:** Matching definitions grouped first by category and then keyed by node display name.
