---
title: tempest/network/watch
summary: Enables a temporary live feed of peer commands and telemetry for the network map.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Clients and Telemetry

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node` | `string` | Required | Selected peer node name. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | `boolean` | Live peer traffic is available on `tempest/network/traffic`. |
