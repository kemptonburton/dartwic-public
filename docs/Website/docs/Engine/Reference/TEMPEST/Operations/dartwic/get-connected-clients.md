---
title: dartwic/get-connected-clients
summary: Returns connected clients.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Clients and Telemetry

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `connected_clients` | `array<ConnectedClient>` | Registered clients currently connected to this engine, including client identity, display metadata, version metadata, and connection data. |
