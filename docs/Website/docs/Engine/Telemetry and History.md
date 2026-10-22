---
summary: Distinguish latest values, asynchronous recording, and historical range queries.
updated: 2026-10-16T08:43
created: 2026-08-03T15:41
---

RAPID keeps the latest channel state and can also record accepted value writes. Background telemetry periodically observes current state for application clients; history stores samples for later queries. Neither is a substitute for the other.

## The three channel paths

Every accepted channel commit has one source of truth and two downstream consumers:

```text
RAPID live channel store
  ├─ task/calculation/direct-query state
  ├─ recording ingress → historical storage
  └─ periodic observation → TEMPEST → subscribed application clients
```

The live store is what RAPID tasks and explicit query operations use. Recording is a bounded historical stream. Periodic telemetry copies one channel record at a time. A fixed-channel collector tries the slot lock and skips busy slots, retaining its last successful observation and original timestamp; a channel never successfully read remains absent until a read succeeds. The bounded copy can briefly delay another caller. Metadata resolution, formatting and network work happen after unlocking, so a slow browser does not hold that slot lock.

## Choose a recording policy

| `record_mode` | Samples recorded |
| --- | --- |
| `on_value_change` | Writes that change the value. A constant signal can have sparse history. |
| `every_value` | Every accepted value write. Use when repeated equal samples matter. |
| `never` | No write-triggered samples; the channel remains available live. |

The periodic auto recorder is a separate path. By default it snapshots channels once per second, including fixed, remote, and diagnostic channels marked `never`. The `engine_rapid_autorecord_*` controls configure this sampling and appear under **recording** with the writer controls in the Tasks / Modules channel view. Write-triggered history and periodic snapshots can therefore coexist; `record_mode: never` alone does not establish that a channel has no history.

[Dataframes](../Interface/DataFrames.md) save named time ranges over this history. They may select channels, ARGUS events, and logs for review without changing which samples are recorded. A view can remain after its live channels are removed.

## Understand delivery

A local value commit runs its dependent calculations inline. Recording queues and telemetry publishers then process data asynchronously. This separation is deliberate: display, recording, TEMPEST peer, and ordinary observer delivery must not run arbitrary consumer work on a CAESAR callback or become a control acknowledgement. A slow UI does not prove the calculation was late; a current UI does not prove the newest sample is already on disk.

Telemetry samples channels periodically rather than delivering every accepted write. A task does not commit all of its outputs as one atomic batch. The engine offers a complete `rapid/channels/snapshot` batch at 5 Hz, with full observed records for each client's subscribed channels, including unchanged values and missing-channel status. The batch includes its sequence and destination client ID. Busy slots can retain older observations and source timestamps. [Using TEMPEST](Using%20TEMPEST.md#receive-live-values) explains the envelope and recipient filtering.

Inspect the recording queue and persistence diagnostics when recent history is missing. Telemetry can coalesce intermediate updates for display, so a browser graph is not a lossless record of every engine write.

WebSocket telemetry drops new observations when retained payloads reach 64 MiB / 4,096 messages per connection or 256 MiB / 16,384 messages across the adapter. These limits include queued and in-flight payloads. Inspect transport drops and retained bytes in [Diagnostics](../Interface/Diagnostics.md); an offered 5 Hz cadence does not prove receipt or rendering. The limits do not change recording admission or HTTP command results.

## Query historical samples

Range bounds are **Unix-epoch nanoseconds**, including `from` and `to` in `rapid/query-channel-range`. Do not send seconds or JavaScript millisecond timestamps without conversion.

```python
import time
end_ns = time.time_ns()
result = client.query_channel_range(
    series=["|tank_pressure|"],
    from_timestamp=end_ns - 60_000_000_000,
    to_timestamp=end_ns,
    bucket_count=500,
)
```

Use the [Python guide](../Clients/Python%20Client.md) for setup and result handling. For large work, the engine also exposes detached historical query and export operations; [Using TEMPEST](Using%20TEMPEST.md#detached-jobs) explains their lifecycle.

## Preview versus raw data

Bucketing reduces returned points for a graph or analysis preview. Omit the bucket count when you need raw range-query samples. The [Telemetry Exporter](../Interface/Telemetry%20Exporter.md) makes this distinction explicit: graph previews can be bucketed, while CSV export uses raw recorded data.

Before widening a query, confirm the channel and recorded time coverage. Empty history may reflect recording policy, deletion, retention, or the requested time range; it is different from a stale live value.

## Recording queue capacity and loss

Recording and asynchronous channel notifications have separate queues and loss counters. Recording loss concerns historical samples; notification loss concerns delivery to asynchronous channel observers.

RAPID recording ingress has separate finite scalar and bulk queues. The defaults are 262,144 scalar rows, 8,388,608 bulk rows, 201,326,592 bulk payload bytes, and 1,024 bulk block descriptors. Capacity applies to pending ingress data, not all engine memory. Writer batches, RapidLog indexing, and historical indexes are separate consumers of memory.

When a queue fills, admission rejects incoming samples or whole blocks and counts the loss. Existing admitted work remains queued. Each producer retains its enqueue order; concurrent producers do not establish a total timestamp order. Scalar and bulk queues remain separate, and history indexing orders the stored samples by timestamp. Live channel values and authority are unchanged by history loss. Stopping recording drains pending data without inserting capacity-consuming sentinel records.

Bulk admission reserves capacity before constructing or copying its payload. Concurrent construction counts against ingress capacity. A full reservation rejects the incoming block before payload creation; ordinary construction and queue allocation can still fail after reservation. No prepared channel caller performs this bulk construction.

The existing persistence diagnostics expose `recording_queue_rows`, `recording_queue_bytes`, `recording_queue_row_capacity`, `recording_queue_byte_capacity`, and `recording_dropped_rows_total`. `queue_depth` remains the legacy descriptor count. The engine's `rapid_recording_queue_depth` channel now counts rows, including rows in writer batches. Background reporting emits a recording-loss message and a correlated ARGUS error.

The compatibility fields `recording_retired_rows`, `recording_retired_bytes`, `recording_retired_row_capacity`, and `recording_retired_byte_capacity` are zero for the current moodycamel ingress implementation; it does not evict old payloads into a retirement queue.

RapidLog also bounds its **pending index handoff** to 1,024 blocks, 8,388,608 rows, and 268,435,456 retained payload bytes. These rows have already been written to disk, so a full index handoff waits on background recording workers instead of discarding index entries. The `index_queue_rows`, `index_queue_bytes`, `index_queue_row_capacity`, and `index_queue_byte_capacity` diagnostics describe that separate queue. If indexing remains stalled, recording ingress can fill and lose pending history under its policy above.

The active index batch can hold another queue-sized set of blocks. Writer batches, temporary splitting of oversized blocks on recording workers, and the historical in-memory index are separate; the index of retained history still grows. These queue limits are not a cap on total RAPID memory.

The current RapidLog history index retains a 24-byte record per indexed sample in RAM, plus container and metadata overhead. At five million samples per second, those records alone add approximately 120 MB/s of retained memory. A recording-rate test must therefore state its duration and available RAM as well as disk throughput and queue losses. Stopping acquisition stops new history growth; empty queues do not release retained history.

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

Explicit capacities must be positive integers. Ordinary recording uses bounded moodycamel queues; actual execution owners use prepared per-thread recording buffers. Accepted bulk payload construction still allocates and copies samples on the caller. Complete history processing is not certified as bounded real-time work. Monitor losses and qualify your workload before relying on a chosen capacity.

## Asynchronous channel notification capacity

The ordinary channel notification queue admits at most **8,192 notifications**. Eligible prepared numeric fixed writes use one of **64** per-owner observation buffers with **1,024** entries each. The notification worker drains these alongside the ordinary queue. These are delivery-backlog limits, not a guarantee that external consumers keep pace.

When a notification buffer fills, admission drops and counts the incoming observation. Accepted live values, command authority, and synchronous calculations are unaffected. Ordinary rich notifications and legacy batches may allocate on their caller; the prepared numeric result does not extend to every notification shape.

Persistence diagnostics expose notification queue depth/capacity and overwritten totals separately from `recording_dropped_rows_total`. The overwrite count records rejected asynchronous notifications; a rich batch can contain several writes. The engine reports publication backpressure through ARGUS.

The live values preserved by notification overflow are local to this RAPID instance. TEMPEST peer also consumes these asynchronous notifications, so a local commit does not guarantee delivery of every update to a remote node. Remote command workflows need their own acknowledgement, freshness, and fault-response contract; notification loss is not only a display concern.

## Project configuration and local state

Track `<workspace>/<project>/rapid/channel_snapshot.json` in Git. It stores channel configuration, metadata, and explicit startup values. Remote TEMPEST peer records also include their full last known value and timestamp so offline mirrors can be restored from the snapshot. Local live values and timestamps are saved separately in `engine/instances/<instance-id>/runtime/<project-name>/rapid/channel_state.json`; RapidLog samples and CSV exports stay under that instance's RAPID directory. ARGUS uses the adjacent `argus/` directory.

A fresh project clone restores configured startup values without needing another engine's runtime state or recordings. See [Tracking a Project in GitHub](../Getting%20Started/Tracking%20a%20Project%20in%20GitHub.md) for the full layout and cloning workflow.
