---
title: tempest/peers/telemetry
summary: Lists telemetry topics registered by a connected peer.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node` | `string` | Required | Connected peer node name. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `telemetry` | `array<object>` | Peer-visible topic descriptors. |
