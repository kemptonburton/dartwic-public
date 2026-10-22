---
summary: Save a named time range for channel, event, and log history.
updated: 2026-10-21T01:02
status: coming-soon
created: 2026-08-03T15:41
---

A dataframe is a named view of history: a start and end time, an optional channel list, and event and log filters. It does not copy or tag samples. There is no default dataframe. An empty channel list shows all recorded channels in the range.

## Mark a live run

1. Open **Data → Dataframes** and choose **New dataframe**.
2. Choose **Start now**, name the run, and optionally select channels.
3. Set events and logs to **All**, **Related channels**, or **Off**. Optionally choose an origin node and a named log stream.
4. Choose **Start dataframe**. The engine stores its current timestamp and returns a stable frame ID.
5. Choose **Stop dataframe** when the run ends. The engine closes the range at its current timestamp.

Start and Stop mark time only. They do not change `record_mode`, the periodic recorder, live channel state, or running tasks. Samples continue to follow the existing recording policy. An active run interrupted by an engine restart ends at its last saved checkpoint and is shown as **Interrupted**.

DCode can use `startDataFrame(name, options?)` and `stopDataFrame(id)` for the same operation. The start call returns the ID used by stop. For example:

```dcode
local run = startDataFrame("Tank fill", {"channels": ["tank_pressure"], "events": "related", "logs": "off"})
# Run the test sequence here.
stopDataFrame(run)
```

## Save existing history

Choose **From history**, set a time range and name, and optionally select channels and filters. The view immediately shows any matching history already recorded. Overlapping frames can show the same samples. Removing a live channel does not remove its recorded samples.

**Related channels** matches explicit channel references in ARGUS events and logs against a nonempty selected channel list. It does not search titles, messages, or text for similar words. Named streams narrow logs further; node filters narrow events, logs, and channels by origin.

## Review and export

Search Dataframes by name and open a view. The telemetry viewer loads up to 100 matching dataframe rows near the middle of its current time range, then moves a 100-row window through the matching catalog as you scroll. Each step loads up to 50 rows and releases rows at the opposite end; searching checks the full matching catalog. The combined dataframe timeline shows green presence across the entire graph range using bounded occupancy buckets independently of the loaded rows. Its blue background follows the time span covered by the current dataframe row window. Event and log blue spans likewise reach the graph range's edges when their lists have exhausted paging in those directions. Each column shows its loaded count and matching count for the range. Click a green interval outside the loaded rows to seek the list near that time; loaded dataframe intervals can be selected directly. Its graph, channel list, events, and logs use the saved range. The channel list is a continuous virtualized scroll, with rows and sample counts loaded near the viewport. Select channel rows and choose **Add selected to plot**, or drag a channel row onto the graph to add a series. **Select all channels** selects the entire matching list, including off-screen rows; with a search active it selects all matching channels. This reads channel names without loading every sample count. The same button clears those matching selections once all are selected. Selection survives scrolling and search changes. In telemetry, channel export includes both plotted series and these checked channels over the paused graph's visible range, with duplicates removed; adding selected channels to the graph is optional. A graph can still be queried directly by channel name and time bounds outside a saved view.

The graph hover tooltip shows one dataframe count for the interval, including when an overview interval and a loaded dataframe row overlap. Click the dataframe timeline to inspect or select a matching view.

In **Data → Dataframes**, check one or more frames and choose **Export selected dataframes**. Each checked frame downloads as a separate ZIP containing its channel CSV, events, logs, and manifest under its saved filters. Active frames freeze their export end time when their job starts. The browser may ask to allow multiple downloads. A failed frame reports its error while the remaining checked frames continue exporting. The open dataframe also offers an export with an optional channel subset.

The shared export progress popup shows the current dataframe and completed-file count. **Cancel export** or **X** cancels the current job and stops the remaining selected frames. Outside clicks and Escape do not dismiss the popup; use **Close** or **X** after it finishes. Reloading, disconnecting, or switching clients stops remaining export work. Cancellation keeps files already sent to the browser download manager.

Dataframe cards and list rows show channel, datapoint, log, and logical-event counts plus **EST. DATA MB** before exporting. The summary counts channel records through storage aggregates, without loading or formatting their values. Estimated bytes use 24 bytes per channel record and event/log field payload lengths and scalar sizes. This excludes shared dictionaries, compression, database/index/container overhead and is not exclusive disk usage or CSV/ZIP size. Shared records count in each matching dataframe. Pending components show an ellipsis until counted; total MB stays pending until all included components finish. The shared blue bar remains visible during loading; refresh to update an active frame.

The grid and list render only the rows near the viewport and fetch 50-frame metadata pages as you scroll. Only visible cards request statistics, with at most two readers active. Search checks the full catalog by dataframe name or its explicitly selected channels. Checked selections remain available after their rows scroll out of view or a search changes. **Select visible dataframes** checks the rows currently on screen; **Clear selection** clears the whole selection.

The export popup shows channels, datapoints, logs, logical events, occurrences and measured data bytes as they are processed, separately from downloaded bytes and archive/file progress. **EST. %** shows one overall work estimate across every selected file, preparation stage and download. It never moves backward between stages or files and reaches 100% after the exports finish. Files have equal shares; each file reserves 90% for preparation and 10% for download. The engine weights counting, channel records, events, logs and packaging within preparation. These are work weights, not time remaining; the percentage can pause while a stage has no measurable total. A moving blue accent indicates ongoing work. Final dataframe counts and bytes also appear in its exported manifest.

The channel database reads stored catalog counts. Dataframe counts apply the saved time range and filters, so they still require background range queries and event/log searches. Summaries no longer run the export formatting pass; exact exported CSV/JSONL bytes are measured only when exporting.

Exports and history requests identify the saved view by its stable ID, so renaming the view does not change its identity. For any combination of channel CSV, logs, and events over a paused graph's visible range, use [Telemetry Exporter](Telemetry%20Exporter.md#export-a-visible-range).

A saved view does not protect recordings from retention. If old samples, events, or logs expire, the view shows the remaining available history. Removing a dataframe deletes its metadata and keeps its recordings. To erase underlying history, use the separate **Delete recordings** action and review its preview. That action does not delete live channels or a remote owner's records.

[Recorded Data](Recorded%20Data.md) explains storage and automatic retention. The [client guides](../Clients/Python%20Client.md) show channel and time range queries.
