---
title: argus/mark-logs-viewed
summary: Clears shared log warning and error indicators through a displayed record.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Logs

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node` | `string` | Required | Originating node. |
| `session` | `string` | Required | Process session. |
| `stream` | `string` | Required | Named text stream. |
| `through_sequence` | `integer` | Required | Last displayed record sequence. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `viewed` | `boolean` | The viewed position was updated. |
