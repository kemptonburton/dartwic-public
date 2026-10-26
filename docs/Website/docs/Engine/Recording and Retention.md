---
summary: Choose recording policies, query history, recognize loss, and manage retention.
created: 2026-08-03T15:41
updated: 2026-10-26T14:16
---

Recording saves past measurements so you can graph a test, compare it with events, or export its data later. RAPID holds each channel's latest value in memory and stores recorded samples separately on disk.

**Retention** decides how long those recordings remain available. Recording policy determines what is saved; a dataframe selects a named range to review; retention can eventually remove the underlying history.

# The three channel paths

A live value answers “what is the latest reading?” History answers “what happened during this interval?” Telemetry delivers observations to connected applications:

```text
RAPID live channel store
  ├─ task/calculation/direct-query state
  ├─ recording ingress → historical storage
  └─ periodic observation → TEMPEST → subscribed application clients
```

Tasks and direct queries read live state. Recording saves admitted samples; telemetry sends observations independently. A value can be available locally before its history or display update arrives. Check source timestamps when you need to know how fresh a reading is.

# Choose a recording policy

The `record_mode` field controls samples produced by value writes. Choose whether you need every accepted sample or only changes:

| `record_mode` | Samples recorded |
| --- | --- |
| `on_value_change` | Writes that change the value. A constant signal can have sparse history. |
| `every_value` | Every accepted value write. Use when repeated equal samples matter. |
| `never` | No write-triggered samples; the channel remains available live. |

The periodic auto recorder is a separate path. By default it snapshots channels once per second, including fixed, remote, and diagnostic channels marked `never`. The `engine_rapid_autorecord_*` controls configure this sampling and appear under **recording** with the writer controls in the Tasks / Modules channel view. Write-triggered history and periodic snapshots can therefore coexist; `record_mode: never` alone does not establish that a channel has no history.

[Dataframes](../Interface/DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md) save named time ranges over this history. They may select channels, ARGUS events, and logs for review without changing which samples are recorded. A view can remain after its live channels are removed.

# Understand delivery

Accepted writes update live state and run dependent calculations inline. Recording and telemetry continue in the background. [Execution and Timing](Execution%20and%20Timing.md) explains those completion boundaries.

Display telemetry can omit intermediate writes. Compare recorded samples when investigating a cycle, and inspect recording diagnostics if recent history is missing.

# Query historical samples

A range query retrieves a channel's recorded samples between a start and end time. Recorded timestamps are **Unix-epoch nanoseconds**: integer nanoseconds since the UTC epoch. Use those bounds for precision. `rapid/query-channel-range` also normalizes epoch milliseconds and microseconds by magnitude, but does not accept epoch seconds. This example requests the last minute:

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

Use the [Python guide](../Clients/Python%20Client.md) for setup and result handling. For large work, the engine also exposes detached historical query and export operations; [Using TEMPEST](Advanced/Using%20TEMPEST.md#detached-jobs) explains their lifecycle.

# Preview versus raw data

**Bucketing** reduces the points returned for a preview so a long recording can fit a graph. Raw samples retain the recorded points. Omit `bucket_count` for a raw range query; [Telemetry Graphs](../Interface/Telemetry%20Graphs.md) can use a bucketed preview while CSV exports use raw data.

Before widening a query, confirm the channel and recorded time coverage. Empty history may reflect recording policy, deletion, retention, or the requested time range; it is different from a stale live value.

# Missing samples and delivery loss

Recording queues hold samples waiting for storage. When full, they reject and count incoming samples while retaining admitted work. Live values and command authority remain unchanged. Check `recording_dropped_rows_total` and whether recording progress is keeping up; stopping recording drains pending work.

Notification queues and network transports have their own loss counters. A missed display or peer update does not by itself establish missing recorded history. Indexing delays can also make stored samples take longer to query.

[Recording and Delivery Tuning](Advanced/Recording%20and%20Delivery%20Tuning.md) owns queue capacities, index behavior, and restart configuration. Use [Diagnostics](Diagnostics%20and%20Troubleshooting.md) to identify which path is falling behind.

# Dataframes, retention, and deletion

A dataframe saves a time range and channel/event/log filters over existing databases. Empty channel selection includes all recorded channels in that range. Frames can overlap without copying records. Starting a frame does not start recording; an interrupted active frame ends at its saved checkpoint.

History cleanup uses separate age and size limits for channels, events, and logs, with workspace defaults and project overrides. Zero leaves that limit unrestricted. Saved dataframes do not protect history from automatic retention.

Removing a frame deletes its metadata. Deleting recordings removes the selected local records and can affect overlapping frames; the preview identifies shared data before applying. This does not remove live channels or a remote source's original archive. Logical removal and disk-space reclamation can complete separately.

The [data guide](../Interface/DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md) owns browsing and export workflows. [Configuration and Storage](Configuration%20and%20Storage.md#file-ownership) gives instance paths and backup boundaries.
