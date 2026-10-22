---
title: dartwic/add-schematic-node
summary: Adds schematic node.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Schematics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node_category` | `string` | Required | Schematic-node category; `category` is accepted as a compatibility alias. |
| `node_name` | `string` | Optional | Node type name; `name` is accepted as a compatibility alias and may instead be inferred from the single entry in `node`. |
| `node` | `object` | Required | Node definition, either as the definition itself when `node_name` is supplied or as an object keyed by node name. |

## Response payload

This operation returns an empty payload (`{}`).
