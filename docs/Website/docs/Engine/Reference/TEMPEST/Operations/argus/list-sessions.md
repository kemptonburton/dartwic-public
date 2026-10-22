---
title: argus/list-sessions
summary: Lists sessions.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `limit` | `integer` | Optional | Maximum local session count; defaults to 100. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `sessions` | `array<ArgusSession>` | Local ARGUS sessions plus synthetic `connected` sessions for connected remote engine nodes. |
