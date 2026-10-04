---
updated: 2026-06-23T04:39
created: 2026-05-01
---

Export is most useful when you already know the channels and time range you want. Start focused and widen only if the result is still too small.

# Finding Data

1. Find the relevant dataframe or grouping.
2. Search for the channel keys you actually need.
3. Query a small time window first.
4. Widen only after confirming the data shape is right.

# Range Queries

Range queries are the normal way to pull history for analysis. Query one or a few channels first, use explicit start and end times, and keep the first request narrow enough to inspect quickly.

# Bucketing and Decimation

Use decimation when:

- you are plotting long spans
- you need a quick trend rather than exact replay
- you want a smaller export for external tools

Keep raw, high-density exports for cases where exact timing matters.

# CSV Export

CSV is the simplest handoff format when another team wants the data or you are moving into Python, spreadsheets, or a BI tool.

# Practical Advice

- do not export the whole world by default
- verify one sample query before launching a larger job
- prefer decimated summaries for dashboards and quick review
- prefer denser/raw exports for engineering analysis

# Related Reading

- [Telemetry Exporter](Telemetry%20Exporter.md)
- [DataFrames](DataFrames.md)
- [Telemetry and History](../Engine/Telemetry%20and%20History.md)
- [Python Query Example](../Clients/Python%20Query%20Example.md)
