---
title: tempest/network/traffic
summary: Reports live command and telemetry activity on a connected TEMPEST peer.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Clients
- **Direction:** Server → clients

## Delivery

Emitted only during a short, renewed `tempest/network/watch` lease; the engine does not retain messages.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `node` | `string` | Always | Peer node name. |
| `direction` | `string` | Always | `incoming` or `outgoing` relative to this engine. |
| `kind` | `string` | Always | `command` or `telemetry`. |
| `name` | `string` | Always | Peer operation or telemetry topic. |
| `request_id` | `string` | Always | Correlates command request and response messages. |
| `status` | `string` | Always | `pending`, `completed`, `failed`, or `published`. |
| `error_code` | `string` | Always | Remote error code, when present. |
| `details` | `string` | Always | JSON preview of the Value payload, limited to 4096 bytes. |
| `timestamp` | `integer` | Always | Unix time in milliseconds. |
