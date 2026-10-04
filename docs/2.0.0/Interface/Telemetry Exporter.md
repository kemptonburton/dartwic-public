---
updated: 2026-06-23T04:39
created: 2026-06-23
---

The Telemetry Exporter is for historical channel data. Use it when you need a bounded time range, graph, CSV export, or analysis handoff.

# Good Export Workflow

1. Start from Channel Search, a dataframe detail view, or a schematic graph.
2. Select one or a small group of channels.
3. Pick a dataframe when needed.
4. Query a small time range first.
5. Use bucketing or decimation for long spans.
6. Export CSV only after the graph and sample shape look right.

# What To Avoid

- exporting every channel by default
- querying very long raw ranges before testing a small window
- assuming a channel has history just because it has a live value
- mixing dataframes without checking which one contains the recorded samples

# Read More

- [Exporting Data](Exporting%20Data.md)
- [DataFrames](DataFrames.md)
- [Telemetry and History](../Engine/Telemetry%20and%20History.md)
- [Python Query Example](../Clients/Python%20Query%20Example.md)
