---
title: argus/watch-log-stream
summary: Watches one log stream for appended records.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Logs

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `watch_id` | `string` | Required | Unique identifier for the open log view. |
| `node` | `string` | Required | Originating node. |
| `session` | `string` | Required | Process session. |
| `stream` | `string` | Required | Named stream. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `watching` | `boolean` | Watch was registered. |
