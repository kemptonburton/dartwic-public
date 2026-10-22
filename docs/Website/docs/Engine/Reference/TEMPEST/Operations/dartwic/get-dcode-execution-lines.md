---
title: "dartwic/get-dcode-execution-lines"
summary: "Returns DCode execution lines."
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `script_path` | `string` | Optional | Optional script path used to filter execution-line information. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `activations` | `object<string, ExecutionLineSnapshot>` | File-level activation snapshots keyed by script path. |
| `tasks` | `object<string, ExecutionLineSnapshot>` | Active execution snapshots keyed by task identity. |
| `loops` | `object<string, ExecutionLineSnapshot>` | Active execution snapshots keyed by runtime-loop identity. |
| `calculations` | `object<string, ExecutionLineSnapshot>` | Reserved empty object; channel calculations do not publish execution-line snapshots. |
