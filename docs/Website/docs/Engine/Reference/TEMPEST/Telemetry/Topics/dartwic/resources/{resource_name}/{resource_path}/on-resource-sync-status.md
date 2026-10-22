---
title: dartwic/resources/{resource_name}/{resource_path}/on-resource-sync-status
summary: Reports whether a client is actively saving, pulling, or synchronizing a resource.
created: 2026-08-04T16:32
updated: 2026-10-20T18:59
---

- **Category:** Resource Collaboration
- **Direction:** Client → server → clients

## Delivery

Sent when a resource synchronization phase starts or ends and relayed to other connected clients.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `kind` | `string` | Always | Synchronization activity, such as `saving`, `pulling`, or `syncing`. |
| `active` | `boolean` | Always | Whether that activity is currently in progress. |
| `timestamp` | `integer` | Always | Sending client's Unix-epoch timestamp in milliseconds. |
