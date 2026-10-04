---
updated: 2026-06-23T04:39
created: 2026-06-23
---

Channel Search is the fastest way to inspect live RAPID state. Use it when you know the signal name, need to compare fields, want to open an exporter, or need to understand why a value is stale or not commandable.

# What It Shows

- channel name
- latest value
- units
- freshness and not-found state
- small live graph
- editable fields such as `value`, `units`, `record_mode`, `stale_timeout`, `data_frame`, and `mapped_channel`
- read-only fields such as `timestamp`, `commanded_by`, `control_owner`, `active_controller`, `mean`, and `stdev`
- links into related task, dataframe, script, or exporter views
- remote source or node context when a channel is surfaced from another runtime

# Common Uses

- search for channels by module, task, system, or signal name
- check whether timestamps are moving
- inspect all fields on one channel
- edit a writable metadata field
- open selected channels in the telemetry exporter
- open the dataframe view for a recorded channel
- check whether a remote channel is stale, disconnected, or missing
- verify command authority before writing a value

# Related Engine Concepts

- [Channels](../Engine/Channels.md)
- [Commanding and Control](../Engine/Commanding%20and%20Control.md)
- [Telemetry and History](../Engine/Telemetry%20and%20History.md)
- [DataFrames](DataFrames.md)
- [RAPID Share and Remote Nodes](../Engine/RAPID%20Share%20and%20Remote%20Nodes.md)
