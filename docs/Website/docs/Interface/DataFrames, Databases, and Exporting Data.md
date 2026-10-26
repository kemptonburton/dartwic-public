---
summary: Save runs, browse recorded data, and choose what to export or delete.
created: 2026-08-03T15:41
updated: 2026-10-24
---

Open **Data** to review recordings on the connected Engine. **Databases** browse the underlying history. **Dataframes** save named time ranges and filters so you can return to a test or export it later.

# Choose a database

| Database | Contains |
| --- | --- |
| RAPID Channels | Recorded numeric samples and timestamps. |
| ARGUS Events | Event records and occurrences. |
| ARGUS Logs | Text output grouped by stream and process session. |

Choose a database, set a calendar range, and filter by source or text as needed. Channel rows show sample counts and oldest/newest timestamps. **Review selected channels** opens [Telemetry Graphs](Telemetry%20Graphs.md).

Event and log viewers load pages. The calendar separates the selected query range, loaded coverage, and currently visible rows. Scrolling does not change your query dates. These views read this Engine's retained history, including remote data recorded here; they do not query another node's complete archive.

# Mark a live run

1. Open **Data → Dataframes → New dataframe**.
2. Choose **Start now**, name the run, and optionally choose channels.
3. Select events and logs: **All**, **Related channels**, or **Off**. Optionally narrow the node or log stream.
4. Choose **Start dataframe**, then **Stop dataframe** when the run ends.

Start and Stop mark the range; recording policies and running tasks continue independently. A dataframe interrupted by an Engine restart ends at its saved checkpoint and appears as **Interrupted**.

A script can mark the same range inside a sequence or timeline bucket:

```dcode
local run = startDataFrame("Tank fill", {"channels": ["tank_pressure"], "events": "related", "logs": "off"})
# Run the test sequence here.
stopDataFrame(run)
```

# Save existing history

Choose **From history**, enter a name and time range, and select channels and filters. A dataframe is a saved view; it does not copy or tag samples. An empty channel list includes all recorded channels in its range. Overlapping frames can show the same records.

**Related channels** matches explicit channel references against a nonempty selected list. It does not search message text for similar words. Node and stream filters narrow the saved selection further.

Open a frame to review its graph, channels, events, and logs. Add checked channels to the plot or drag them onto it. **Select all channels** includes off-screen matching rows; in the dataframe list, **Select visible dataframes** checks only on-screen frames. Selections survive scrolling and search changes; **Clear selection** clears them.

# Choose an export

| Starting point | Scope and files |
| --- | --- |
| Database → Export selected range | Calendar dates and current filters. Channels use checked rows, or all matching channels if none are checked. Raw CSV for channels; JSON Lines (`.jsonl`) for events/logs. |
| Paused graph → Export telemetry | Its full visible range and selected data types. See below. |
| Dataframes → Export selected dataframes | One ZIP per frame with channel CSV, events, logs, and a manifest under its saved filters. |

Exports include matching history beyond the currently loaded pages. An active frame's export end is frozen when the job starts. A frame export failure is reported while remaining selected frames continue. An open frame can also export an optional channel subset.

## Export a visible range

Pause the graph and open **Export telemetry**. Check **Channels**, **Logs**, and/or **Events**, then choose **Export visible range**. Export is disabled while live. The menu captures the full visible X-axis range when opened, including intervals with no preview points.

Channels include plotted series and checked channels in the open dataframe list, with duplicates removed. Logs and events use the displayed range and saved-frame filters. Preview bucketing does not reduce raw export samples.

CSV rows use recorded timestamps, leaving cells empty when a channel has no sample at that timestamp. Repeated samples for the same channel and timestamp use the last recorded value. A multichannel CSV is not necessarily a complete acquisition grid.

## Progress and cancellation

Large exports need time and temporary disk space. Channel jobs read bounded batches and sort raw samples; datapoint counts can differ from CSV row counts because timestamps are merged. Progress estimates work, rather than time remaining.

**Cancel export** or **X** stops remaining work; files already handed to the browser are kept. Cancellation may take time to settle. Outside clicks and Escape leave the popup open. Multiple data types can require browser permission for multiple downloads.

Reloading, leaving the exporting view, disconnecting, or switching clients stops export; reconnection does not resume it. Read download errors before retrying. When HTTP download is unavailable, an error can include the Engine's local output path.

# Retention and deletion

| Action | Effect |
| --- | --- |
| Remove a dataframe | Deletes the saved view and keeps its recordings. |
| Delete recordings | Removes selected underlying history on this Engine. Review the preview and affected frames. |
| Automatic cleanup | Applies the configured age and storage limits to each database. |

A saved frame does not protect history from automatic retention. It shows whatever remains available. Deletion previews identify recordings shared with other frames; including those records affects those views too. Live channels and a remote source's original archive remain separate. Disk-space reclamation can finish after the logical removal.

Configure cleanup under **Settings → Engine → History and recording**. Frame size is an estimate, not exclusive disk use or final ZIP size: shared records count in each frame, and output overhead/compression differs. [Recording and Retention](../Engine/Recording%20and%20Retention.md) explains recording policies, timestamps, and loss.
