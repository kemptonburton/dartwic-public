---
title: dartwic/resources/{resource_name}/{resource_path}/on-live-resource-presence
summary: Broadcasts a client's live presence for a specific resource.
created: 2026-09-04T17:13
updated: 2026-10-20T18:59
---

- **Category:** Resource Collaboration
- **Direction:** Client → server → clients

## Delivery

Sent explicitly by a resource UI; the server adds the sender's client ID, username, instance number, and telemetry timestamp before broadcasting.

## Payload

**`object`:** Resource-specific presence state augmented with `clientId`, `username`, `instance_number`, and `timestamp`.
