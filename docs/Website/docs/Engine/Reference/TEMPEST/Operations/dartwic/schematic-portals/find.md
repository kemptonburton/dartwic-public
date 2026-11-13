---
title: dartwic/schematic-portals/find
summary: |-
  Finds linked portal instances in the active project's schematic files, including nested folders.
  Label-only portals are excluded. This synchronous lookup reconciles the file index first.
  Open unsaved documents are overlaid by the Interface rather than written by this operation.
created: 2026-11-11T17:52
updated: 2026-11-11T19:40
---

- **Category:** Schematics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Portal name, compared without case or surrounding whitespace. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `results` | `array<object>` | Linked locations with resource_path, schematic_name, node_id, name, revision, project_revision, node, and connected_edges for configured node and edge previews. Nested project files are reconciled synchronously before returning; open unsaved edits belong to the caller's overlay. |
| `failures` | `array<object>` | Schematic files that could not be indexed. |

## Errors

- Invalid request fields or the project directory cannot be enumerated. Individual unreadable files appear in failures.

## Example

```json
{"name":"FACILITY AIR"}
```
