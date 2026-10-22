---
title: dartwic/send-telemetry-to-clients
summary: Accepts client telemetry and republishes its nested payload on a selected topic.
created: 2026-08-04T16:30
updated: 2026-10-04T21:09
---

- **Category:** Client Relay
- **Direction:** Client → server → clients

## Delivery

The server validates each incoming message, enriches recognized collaboration topics, and broadcasts the nested payload using the requested topic.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `topic` | `string` | Always | Topic used for the republished telemetry message. |
| `payload` | `any JSON value` | Always | Value delivered as the republished message payload. |

## Errors

- The incoming payload is not an object.
- `topic` is missing, is not a string, or is empty.
- `payload` is missing.
