---
title: dartwic/dcode/execution-lines
summary: Publishes a changed execution-line snapshot only to viewers of its script.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** DCode
- **Direction:** Server → clients

## Delivery

Sampled at most five times per second while a client subscribes.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `script_path` | `string` | Always | Tracked script path. |
| `subscription_id` | `string` | Always | Editor view receiving the snapshot. |
| `execution_lines` | `object` | Always | Current snapshot, including empty state when execution stops. |
| `revision` | `integer` | Always | Monotonic revision for this subscription. |
