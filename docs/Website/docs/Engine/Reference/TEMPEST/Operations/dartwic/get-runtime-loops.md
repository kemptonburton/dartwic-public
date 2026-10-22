---
title: dartwic/get-runtime-loops
summary: Returns runtime loops.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive text used to filter local and remote runtime loops. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `loops` | `array<RuntimeLoop>` | Matching CAESAR and DCode loop descriptors, including identity, state, timing, and source metadata. |
| `query` | `string` | Search text supplied by the client. |
