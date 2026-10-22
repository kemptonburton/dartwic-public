---
title: dartwic/tasks/runtime-loops
summary: Publishes a changed runtime-loop list only to the requesting view.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Tasks
- **Direction:** Server → clients

## Delivery

Sampled at most once per second while a view watches.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `watch_id` | `string` | Always | Requesting view ID. |
| `loops` | `array<RuntimeLoop>` | Always | Current filtered loop descriptors. |
| `revision` | `integer` | Always | Monotonic watch revision. |
