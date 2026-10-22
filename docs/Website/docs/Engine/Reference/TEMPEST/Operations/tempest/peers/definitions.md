---
title: tempest/peers/definitions
summary: Lists built-in and plugin-provided peer definitions.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `peers` | `array<object>` | Peer id, display name, protocol, and default connection configuration. |
