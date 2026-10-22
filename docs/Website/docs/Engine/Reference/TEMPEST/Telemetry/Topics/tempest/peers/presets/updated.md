---
title: tempest/peers/presets/updated
summary: Announces a shared peer-command preset change to other operators.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers
- **Direction:** Server → clients

## Delivery

Published after an atomic preset update.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `peer_id` | `string` | Always | Registered peer definition. |
| `node` | `string` | Always | Stable peer name. |
| `id` | `string` | Always | Preset identifier. |
| `action` | `string` | Always | `upsert` or `remove`. |
