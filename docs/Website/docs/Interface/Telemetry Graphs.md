---
summary: Plot signals, navigate live and recorded ranges, and compare events and logs.
created: 2026-10-24
updated: 2026-10-26T21:52
---

Telemetry graphs help you compare signals over time. Open **Telemetry**, or send selected channels from Channels, a dataframe, or a supported schematic graph.

![Telemetry resource with time-range and channel controls.](../_attachments/telemetry-exporter.jpg)

# Add and compare signals

Add a channel series, such as `|tank_pressure|`. Use separate Y axes when signals have different units or scales, and show or hide series to focus on a change.

The **live/realtime** view follows a moving window. Pause to inspect a fixed range, then zoom or change the time window. A historical query needs recorded samples: a signal can be available live with no history for your chosen dates.

# Review recorded history

1. Add the channels you want to compare.
2. Set the date range and start/end times.
3. Select a dataframe filter if you want a saved run.
4. Run or refresh the query, then zoom into the transition you need.

| Preview setting | Effect |
| --- | --- |
| Bucketing: Auto | Chooses a point budget for the graph width. |
| Bucketing: Off | Requests raw points for the preview. |
| Bucketing: Custom | Uses your chosen preview point cap. |
| Timeout Seconds | Limits how long the query waits. |
| Display Format | Chooses the node, channel, and field labels. |

Bucketing reduces the preview. [CSV export](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-a-visible-range) uses raw recorded samples in the selected range.

# Signal status and data gaps

Lines retain their series colors. Legend values show stale or unavailable status and can retain the last known number. Recorded gaps remain visible; a missing sample is not a new zero measurement.

The display update rate does not change acquisition, task scheduling, or recording. Check [Channels](Channels.md#channel-states) for freshness and [Recording and Retention](../Engine/Recording%20and%20Retention.md) for what reaches history.

# Compare events and logs

Enable **Events** or **Logs** to open history beside the plot. Doing this while live freezes the graph at that range. Moving or zooming the graph updates the history selection.

Select an item in the activity strip to inspect its details. Blue spans identify the history pages currently covered; they do not mean a record exists at every instant. See [Events](Events.md) and [Logs](Logs.md) for their controls.

# Saved ranges and exports

Use a [dataframe](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#dataframes-from-recorded-history) to retain the range and filters. Pause and open **Export telemetry** to download the visible range; the [data guide](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-a-visible-range) owns selection and file-format details.

| Problem | Check |
| --- | --- |
| Live value but no history | Recording policy, dates, and dataframe filters. |
| Missing recent samples | Recording backlog or loss in Engine diagnostics. |
| Slow query or too many points | Narrow the time range or channels; use Auto preview bucketing. |
| Missing remote history | Which Engine holds the recordings you are querying. |
