---
title: dartwic/node-health
summary: Publishes the server clock as a lightweight node-health heartbeat.
created: 2026-08-04T16:30
updated: 2026-10-20T18:59
---

- **Category:** Runtime
- **Direction:** Server → clients

## Delivery

Published by the TEMPEST maintenance loop at its configured interval.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `server_time_ms` | `integer` | Always | Current server Unix-epoch timestamp in milliseconds. |
