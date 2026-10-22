---
title: rapid/channels/catalog
summary: Publishes one compact catalog for the current RAPID name index.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Channels
- **Direction:** Server → clients

## Delivery

Complete catalog twice per second; no status subscriptions.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `statuses` | `array<ChannelStatusRow>` | Always | Current name, existence, timestamp, stale timeout, manual-control indicator, availability, and automatic-override indicator. |
