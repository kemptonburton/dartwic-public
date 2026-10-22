---
title: dartwic/set-telemetry-rate-probe
summary: Enables or disables a per-client telemetry cadence probe.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Clients and Telemetry

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | Required | Whether this client should receive one probe frame per RAPID telemetry cycle. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | `boolean` | Applied probe state. |
