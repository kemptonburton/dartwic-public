---
title: dartwic/engine/restarting
summary: Reports progress while the engine restarts or switches projects.
created: 2026-08-04T16:30
updated: 2026-10-04T21:09
---

- **Category:** Runtime
- **Direction:** Server → clients

## Delivery

Published when restart is requested and as the shutdown sequence advances through its phases.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `project_name` | `string` | Always | Project associated with the restarting engine. |
| `phase` | `string` | Always | Machine-readable restart phase. |
| `reason` | `string` | Conditional | Reason supplied when the restart was requested. |
| `status_message` | `string` | Conditional | Human-readable progress message for an active shutdown phase. |
| `processed_channels` | `integer` | Conditional | Channels examined during persistence work. |
| `saved_channels` | `integer` | Conditional | Channels written during persistence work. |
| `snapshot_bytes` | `integer` | Conditional | Bytes written for the runtime snapshot. |
