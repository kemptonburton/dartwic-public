---
title: "dartwic/schematic-portals/rename"
summary: "Renames selected linked portal instances using guarded, atomic per-file updates."
---

- **Category:** Schematics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `old_name` | `string` | Required | Expected portal group name. |
| `new_name` | `string` | Required | Replacement display name. |
| `targets` | `array<object>` | Required | Locations containing resource_path, node_id, revision, and project_revision from find. The project guard rejects targets from a different active project. Refresh only unresolved targets before retrying; at most 10000 instances are accepted. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `results` | `array<object>` | Per-file resource_path and success. Success includes node_ids and means an atomic name-only write completed. Failure includes error for conflicts or failed writes. Other files can succeed; no cross-file transaction is performed. |

## Errors

- Administrator access, nonempty names, and valid targets are required. File conflicts and failed writes are returned in results without overwriting their content.

## Example

```json
{"old_name":"FACILITY AIR","new_name":"SUPPLY AIR","targets":[{"resource_path":"building/air.json","node_id":"air-port","revision":"REVISION_FROM_FIND","project_revision":"PROJECT_REVISION_FROM_FIND"}]}
```
