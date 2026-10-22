---
title: dartwic/telemetry/rate-probe
summary: |-
  Measures the effective server-to-client telemetry cadence without
  multiplying the rate by the number of channel frames in a cycle.
created: 2026-10-04T18:31
updated: 2026-10-04T21:19
---

- **Category:** Clients and Telemetry
- **Direction:** Server → clients

## Delivery

Sent once per RAPID telemetry cycle to clients that enable the probe.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `sequence` | `integer` | Always | Monotonic telemetry-cycle sequence for this engine process. |
