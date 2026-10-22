---
title: tempest/peers/updated
summary: Announces a change to the set or state of TEMPEST peers connections.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** TEMPEST peers
- **Direction:** Server → clients

## Delivery

Published after connect, disconnect, reconnect, and failed automatic reconnect activity.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `action` | `string` | Always | Change kind: `connect`, `disconnect`, `reconnect`, `reconnect-failed`, or `reconnect-remembered`. |
| `node` | `RemoteNode` | Conditional | Affected remote-node descriptor for a single-node change. |
| `error` | `string` | Conditional | Reconnection failure message when `action` is `reconnect-failed`. |
| `result` | `object` | Conditional | Batch reconnection result containing `connected` and `failed` arrays. |
