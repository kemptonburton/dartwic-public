---
title: dartwic/tasks/inventory-changed
summary: Invalidates open task inventories after a structural or running-state change.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Tasks
- **Direction:** Server → clients

## Delivery

Published after the runtime inventory changes.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `revision` | `integer` | Always | Monotonic runtime inventory revision. |
