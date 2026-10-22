---
title: tempest/telemetry/list
summary: Lists telemetry topics declared by this engine and its plugins.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Clients and Telemetry

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `telemetry` | `array<object>` | Built-in and explicitly registered plugin topic descriptors. |
