---
title: dartwic/builder/updated
summary: Invalidates cached Builder reports after Builder state changes.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** DARTWIC Builder
- **Direction:** Server → clients

## Delivery

Published only when the Builder revision changes.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `revision` | `integer` | Always | Monotonic Builder state revision. |
| `latest_sequence` | `integer` | Always | Latest Builder event sequence. |
| `running` | `boolean` | Always | Whether any Builder session is running. |
| `needs_attention` | `boolean` | Always | Whether the latest root session failed or contains an error. |
| `latest_status` | `string` | Always | Latest root Builder session status. |
