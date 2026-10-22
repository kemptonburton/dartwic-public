---
title: argus/events/firing-states-changed
summary: Publishes authoritative ARGUS firing-state transitions.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Events
- **Direction:** Server → clients

## Delivery

Published only when one or more active event firing states change.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `events` | `array<ArgusEventFiringState>` | Always | Changed event IDs and firing states. |
