---
title: argus/events/snapshot
summary: Publishes the complete current ARGUS in-memory board.
created: 2026-08-04T16:30
updated: 2026-10-04T21:09
---

- **Category:** Events
- **Direction:** Server → clients

## Delivery

Complete board every 5 Hz cycle, including unchanged events.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `events` | `array<object>` | Always | Current ARGUS event records. |
