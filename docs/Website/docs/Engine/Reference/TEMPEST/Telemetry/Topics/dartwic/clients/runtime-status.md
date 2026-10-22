---
title: dartwic/clients/runtime-status
summary: Relays the validated runtime status reported by a connected client.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Clients
- **Direction:** Client → server → clients

## Delivery

Best effort when a client publishes runtime status.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | Always | Authenticated reporting client. |
| `telemetry_receive_hz` | `number` | Always | Bounded observed receive rate. |
| `last_operation` | `object\|null` | Always | Latest operation result and timing. |
| `timestamp` | `integer` | Always | TEMPEST publication timestamp. |
