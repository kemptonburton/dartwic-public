---
title: argus/query-logs
summary: Queries a bounded page of ARGUS log records by stream and timeframe.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Logs

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node` | `string` | Optional | Originating node. |
| `stream` | `string` | Optional | Named text stream. |
| `session` | `string` | Optional | Process session. |
| `text` | `string` | Optional | Literal text filter. |
| `channel` | `string` | Optional | Output channel, such as stdout or stderr. |
| `level` | `string` | Optional | Severity level. |
| `from_ns` | `integer` | Optional | Inclusive UTC timestamp in nanoseconds. |
| `to_ns` | `integer` | Optional | Inclusive UTC timestamp in nanoseconds. |
| `limit` | `integer` | Optional | Page size, at most 1000. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `records` | `array` | Bounded page of text records. |
