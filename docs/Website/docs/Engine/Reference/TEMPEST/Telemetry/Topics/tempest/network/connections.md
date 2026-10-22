---
title: tempest/network/connections
summary: Reports observational socket paths for the selected peer.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Clients
- **Direction:** Server → clients

## Delivery

Sent at most once per second to a current network-watch lease.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `node` | `string` | Always | Selected remote node. |
| `peer_id` | `string` | Always | Registered peer definition. |
| `registration` | `string` | Always | Peer registration health. |
| `paths` | `array<object>` | Always | Transport paths with role, endpoint, state, ownership, queue depth, activity and errors. |
