---
title: tempest/operations/list
summary: Lists operations registered on this engine for direct TEMPEST clients.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Clients and Telemetry

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `operations` | `array<object>` | Currently callable operation descriptors. |
