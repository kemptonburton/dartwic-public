---
title: argus/unwatch-log-stream
summary: Stops a client's log-stream watch.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Logs

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `watch_id` | `string` | Required | Identifier of the open log view. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `watching` | `boolean` | False after removal. |
