---
summary: Inspect recording and notification queues, indexing backlog, capacity, and loss.
created: 2026-10-26
updated: 2026-10-26T14:16
---

Recording and channel notifications use separate queues to hand work to background services. Their capacity absorbs bursts; sustained overload can still lose samples or observations. Use this page when diagnostics show backlog or loss and you need to understand the limits or change recording capacity.

Start with [Recording and Retention](../Recording%20and%20Retention.md) for recording policies and history. [Diagnostics](../Diagnostics%20and%20Troubleshooting.md) explains how to identify the affected path. Larger buffers consume memory and cannot make a slow storage or delivery service keep up indefinitely.

# Recording queues

A **recording queue** holds samples waiting for storage workers. Its finite capacity absorbs short bursts without waiting for disk on the control path. Recording queues and notification queues are separate: one concerns historical samples, the other delivery to background observers.

A scalar entry records one sample; a bulk entry carries a block of samples. Their ingress limits—the work allowed to enter the recording pipeline—are separate:

| Ingress limit | Default |
| --- | ---: |
| Scalar rows | 262,144 |
| Bulk rows | 8,388,608 |
| Bulk payload bytes | 201,326,592 |
| Bulk block descriptors | 1,024 |

These bound pending ingress data. Writer batches, indexing, and queries have separate memory costs.

A full queue rejects and counts incoming samples or blocks, retaining admitted work. Producers keep their own enqueue order; the history index orders stored samples by timestamp across producers and queues. History loss leaves live values and authority unchanged. Stopping recording drains pending work.

Bulk writes reserve capacity before copying the block; concurrent construction counts against that capacity. A full reservation rejects before payload creation, but later construction/allocation can still fail. Prepared channel callers use their separate prepared buffers.

Persistence diagnostics expose `recording_queue_rows`, `recording_queue_bytes`, `recording_queue_row_capacity`, `recording_queue_byte_capacity`, and `recording_dropped_rows_total`. The legacy `queue_depth` counts descriptors; `rapid_recording_queue_depth` counts rows including writer batches. Loss also produces a background log message and ARGUS error.

## Indexing

An **index** lets queries locate samples by channel and time. RapidLog's pending index queue holds already-written data, bounded to 1,024 blocks, 8,388,608 rows, and 268,435,456 bytes. A full queue waits on background recording workers rather than discarding index entries. Inspect `index_queue_rows`, `index_queue_bytes`, `index_queue_row_capacity`, and `index_queue_byte_capacity`; stalled indexing can eventually fill recording ingress and cause sample loss.

RapidLog keeps a bounded recent index tail in memory and spills older index rows to derived disk files. Writer/index batches, channel metadata, and query buffers have separate costs, so queue limits do not cap total Engine memory.

## Change recording limits

To change ingress limits, add a `recording_queue` object to the RAPID persistence configuration and restart the engine:

```json
{
  "recording_queue": {
    "scalar_rows": 262144,
    "bulk_rows": 8388608,
    "bulk_bytes": 201326592,
    "bulk_blocks": 1024
  }
}
```

Capacities must be positive integers. Ordinary recording uses bounded queues; prepared execution owners use per-thread buffers. Accepted bulk construction still allocates/copies on its caller. Monitor loss under your workload; complete history processing is not certified as bounded real-time work.

# Channel notifications

A **notification** tells a background observer that a channel changed. Notifications support subscribers and peer exchange; they have their own buffers and loss counters, independently of recording.

| Notification buffer | Capacity |
| --- | ---: |
| Ordinary queue | 8,192 observations |
| Prepared numeric fixed observations | 64 per-owner buffers, 1,024 entries each |

A worker drains both buffers.

When a notification buffer fills, admission drops and counts the incoming observation. Accepted live values, command authority, and synchronous calculations are unaffected. Ordinary rich notifications and legacy batches may allocate on their caller; the prepared numeric result does not extend to every notification shape.

Persistence diagnostics expose notification queue depth/capacity and overwritten totals separately from `recording_dropped_rows_total`. The overwrite count records rejected asynchronous notifications; a rich batch can contain several writes. The engine reports publication backpressure through ARGUS.

TEMPEST peer consumes these notifications too. A local commit can therefore survive while its remote update is lost. Remote control needs explicit acknowledgement, freshness checks, and fault handling.

# WebSocket delivery

WebSocket telemetry drops new observations when retained payloads reach 64 MiB / 4,096 messages per connection or 256 MiB / 16,384 messages across the adapter. These limits include queued and in-flight payloads. Inspect transport drops and retained bytes in [Diagnostics](../Diagnostics%20and%20Troubleshooting.md); an offered 5 Hz cadence does not prove receipt or rendering. The limits do not change recording admission or HTTP command results.

# Check the result

Compare queue depth, persistence progress, and loss counters before and after the change under the same workload. Recording limits apply after an Engine restart. Check recording loss separately from notification and transport drops; a larger queue is useful only if the service can eventually drain it.
