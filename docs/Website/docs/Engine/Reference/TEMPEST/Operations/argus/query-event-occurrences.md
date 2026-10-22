---
title: argus/query-event-occurrences
summary: Returns the firing intervals retained for one logical ARGUS event.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Required | Logical event ID. |
| `node` | `string` | Optional | Originating node; routes to a connected peer node when remote. |
| `limit` | `integer` | Optional | Maximum interval count; defaults to 100. |
| `offset` | `integer` | Optional | Zero-based interval offset. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `occurrences` | `array<ArgusEventOccurrence>` | Newest-first firing intervals. |
| `count` | `integer` | Number of intervals in this page. |
| `total_count` | `integer` | Total interval count. |
