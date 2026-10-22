---
title: tempest/peers/list
summary: Lists configured and connected TEMPEST peers nodes.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `nodes` | `array<RemoteNode>` | Connected nodes plus remembered but currently disconnected nodes, including endpoint, kind, status, per-second uplink/downlink Mbps, and RAPID diagnostic channel paths. |
