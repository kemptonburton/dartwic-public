---
title: tempest/peers/call
summary: Calls a registered TEMPEST operation on the current engine or a connected peer.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Clients and Telemetry

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node` | `string` | Required | Current engine node name or connected peer node name. |
| `operation` | `string` | Required | Fully qualified operation name. |
| `arguments` | `object` | Optional | Operation arguments. |

## Response payload

**object:** Operation result.

## Errors

- Local handler failure, disconnected peer, timeout, invalid arguments, or remote rejection. A remote timeout means unknown completion; operations are never retried.
