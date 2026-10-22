---
title: argus/events/history-refresh
summary: Tells history consumers to refresh after a large mutation batch or bounded publication overflow.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Events
- **Direction:** Server → clients

## Delivery

Published when a queued mutation batch exceeds the ARGUS per-event publish limit, or when bounded publication admission loses messages. Clients refresh from current state and history.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `count` | `integer` | Always | Number of event IDs in a large batch; zero for overflow. |
| `reason` | `string` | Conditional | Present as `overflow` when publication admission loses messages. |
| `dropped_messages` | `integer` | Conditional | Number of publication messages lost since the prior overflow refresh; present only for overflow. |
