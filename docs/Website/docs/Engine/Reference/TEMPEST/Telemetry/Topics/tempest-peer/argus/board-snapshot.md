---
title: tempest-peer/argus/board-snapshot
summary: Sends the sender's complete current ARGUS board selection to one peer.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** TEMPEST Peer
- **Direction:** peer-to-peer

## Delivery

One complete owner-scoped board per 5 Hz telemetry cycle.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `owner_node` | `string` | Always | Authenticated event owner. |
| `events` | `array<object>` | Always | Current ARGUS event records owned by the sender. |
