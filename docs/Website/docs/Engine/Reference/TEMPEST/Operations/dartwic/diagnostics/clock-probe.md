---
title: dartwic/diagnostics/clock-probe
summary: |-
  Samples engine clocks during a read-only request/reply exchange. Available to viewers.
  Receive time is handler entry, not socket arrival; client bounds include dispatch and network delay.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Diagnostics

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `receive_unix_ns` | `string` | Unix nanoseconds at handler entry, as a decimal string. |
| `send_unix_ns` | `string` | Unix nanoseconds just before response construction, as a decimal string. |
| `processing_ns` | `string` | Monotonic nanoseconds between samples; used to reject engine clock jumps. |
