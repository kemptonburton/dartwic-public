---
updated: 2026-06-23
created: 2026-06-23
---

Telemetry is the live and historical data DARTWIC uses to explain what the system is doing.

# Latest Values

The latest channel value is what operators usually see first. A latest value is only useful when its timestamp and freshness state make sense for the workflow.

Check:

- when the value last updated
- whether the value is stale
- whether the source module or task is running
- whether diagnostics suggest a connection or publishing problem

# Record Modes

Record state tells you whether a channel is part of persisted history. If you plan to export or trend data later, make sure the channels you care about are actually recorded.

# DataFrames

`data_frame` is the channel field used to group recorded samples. It is usually a run name, test name, subsystem name, device name, or workflow label.

DataFrames are useful because history often outlives the current live channel set. A dataframe can contain:

- channels that are currently configured and actively recording
- configured channels that have not recorded samples yet
- historical channels that are no longer present in the running project

Do not assume a channel has history just because it has a live value. Check `record_mode`, `data_frame`, and the recorded sample range before exporting.

# Range Queries

Range queries pull historical samples for a bounded time window. Start with one or a few channels, use explicit start and end times, and widen only after confirming the data shape is right.

# Bucketing And Decimation

Use bucketing or decimation when:

- you are plotting long spans
- you need a quick trend instead of exact replay
- you want a smaller export for external tools

Keep raw, high-density exports for cases where exact timing matters.

# Practical Advice

- do not query the whole world by default
- verify a small sample before launching a larger job
- prefer decimated summaries for dashboards and quick review
- prefer denser exports for engineering analysis
- treat missing history differently from stale live data

# Read More

- [DataFrames](../Interface/DataFrames.md)
- [Telemetry Exporter](../Interface/Telemetry%20Exporter.md)
- [Exporting Data](../Interface/Exporting%20Data.md)
