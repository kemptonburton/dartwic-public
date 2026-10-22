---
title: tempest/peers/reconnect-remembered
summary: Reconnects a previously remembered TEMPEST peers node.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `connected` | `array<RemoteNode>` | Remembered nodes that reconnected successfully. |
| `failed` | `array<object>` | Failed reconnections, each containing `host`, `port`, `node_name`, and `error`. |
