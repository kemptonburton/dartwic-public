---
title: dartwic/clients/connected
summary: Announces a client after it registers with the TEMPEST server.
created: 2026-08-04T16:30
updated: 2026-10-04T21:09
---

- **Category:** Clients
- **Direction:** Server → clients

## Delivery

Published once after a successful `register_client` request.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | Always | Unique identifier assigned to the registered client. |
| `username` | `string` | Always | Username supplied during registration; may be empty. |
| `node_name` | `string` | Always | Name of the DARTWIC node accepting the client. |
| `instance_number` | `integer` | Always | One-based instance number for clients sharing a username. |
| `timestamp` | `integer` | Always | Server Unix-epoch timestamp in milliseconds. |
