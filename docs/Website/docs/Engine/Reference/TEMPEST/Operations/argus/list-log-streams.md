---
title: argus/list-log-streams
summary: Lists the named log streams and process sessions available for a node.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Logs

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node` | `string` | Optional | Optional originating node. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `streams` | `array` | Available log streams and sessions. |
