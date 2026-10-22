---
title: tempest-peer/channels/snapshot
summary: Sends the sender's complete locally owned RAPID selection to one peer.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** TEMPEST Peer
- **Direction:** peer-to-peer

## Delivery

One complete owner-scoped snapshot per 5 Hz peer telemetry cycle, including unchanged records.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `owner_node` | `string` | Always | Authenticated channel owner. |
| `channels` | `object<string, object>` | Always | Full RAPID records keyed by local name. |
