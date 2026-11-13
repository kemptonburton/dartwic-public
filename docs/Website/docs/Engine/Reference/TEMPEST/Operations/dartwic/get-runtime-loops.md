---
title: dartwic/get-runtime-loops
summary: Returns runtime loops.
created: 2026-08-03T16:00
updated: 2026-11-12T18:27
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive text used to filter local and remote runtime loops. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `loops` | `array<RuntimeLoop>` | Matching CAESAR and DCode loop descriptors, including identity, state, timing, and source metadata. `average_frequency` is the observed average rate in Hz; `average_frequency_channel` names its published diagnostic channel, or is null when unpublished. Engine 2.2 uses only these average-frequency field names. |
| `query` | `string` | Search text supplied by the client. |
