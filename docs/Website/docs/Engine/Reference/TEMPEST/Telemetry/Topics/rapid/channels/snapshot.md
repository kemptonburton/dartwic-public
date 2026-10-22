---
title: rapid/channels/snapshot
summary: Sends the complete current data of this client's subscribed channels.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Channels
- **Direction:** Server → clients

## Delivery

One complete batch each 5 Hz cycle, including unchanged channels.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `sequence` | `integer` | Always | Telemetry cycle number for diagnostics. |
| `client_id` | `string` | Always | Destination client ID for broadcast transports. |
| `channels` | `object<string, object>` | Always | Full channel payloads keyed by name, with separate exists and available flags and last known data for offline peers. |
