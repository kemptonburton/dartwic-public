---
title: dartwic/clients/disconnected
summary: Announces that a registered client has disconnected or been unregistered.
created: 2026-08-04T16:30
updated: 2026-10-20T18:59
---

- **Category:** Clients
- **Direction:** Server → clients

## Delivery

Published after `unregister_client` and when server maintenance removes a timed-out client.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | Always | Identifier of the disconnected client. |
| `username` | `string` | Conditional | Username recorded for the client when available. |
| `instance_number` | `integer` | Conditional | Instance number recorded for the client when available. |
| `node_name` | `string` | Conditional | DARTWIC node name recorded for the client when available. |
| `timestamp` | `integer` | Always | Server Unix-epoch timestamp in milliseconds. |
