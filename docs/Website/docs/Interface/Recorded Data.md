---
summary: Browse locally recorded channels, ARGUS events, and logs by time range.
created: 2026-10-04
updated: 2026-10-21T00:26
---

Open **Data** to review recordings on the connected engine. **Dataframes** groups a named test; **Databases** lets you browse the underlying history without first creating a dataframe.

## Choose a database

| Database | Contents | Use it to… |
| --- | --- | --- |
| RAPID Channels | Recorded numeric samples and their timestamps. | Find channels, inspect sample counts and coverage, and open a historical graph. |
| ARGUS Events | Event records and their firing history. | Compare a condition's occurrences with a test or measurement. |
| ARGUS Logs | Text records grouped by source stream and process session. | Read engine, plugin, and script output around a failure. |

The Events and Logs databases reuse the corresponding resource viewers. They read the connected engine's retained recordings without merging live events or subscribing to incoming logs. Recorded event details are read-only; **Delete recordings** remains a separate administrator action. Use **Events** or **Logs** in the resource sidebar for live monitoring and history browsing.

Database headers place Reload immediately after the search input, followed by
filters. The calendar and export/review/delete actions sit on the right.

The database cards show local counts and storage usage. A recorded remote-node label identifies the source of data held by this engine; it does not mean this view has queried that node's entire original archive.

## Review a time range

1. Open **Data → Databases** and select a database.
2. Set a time range and, when needed, a source node.
3. Search recorded channel names or apply the event/log filters.
4. For channels, select rows and choose **Review selected channels** to open [Telemetry Exporter](Telemetry%20Exporter.md).

Open the calendar to inspect **Selected range**, **Loaded range**, and **Visible range**. Selected bounds define the query; loaded coverage describes retained rows, and visible timestamps follow the rows currently on screen. Scrolling does not change the selected dates. Recorded coverage and the currently loaded page are different ranges. Events and logs load bounded pages as you scroll. The down-arrow returns to the latest recorded time. An empty filtered range does not establish that the complete database is empty.

The channel table has sortable **Channel**, **Datapoints**, **Oldest timestamp**, and **Newest timestamp** columns. All columns align left, and the table scrolls horizontally when needed.

## Export a selected range

Choose **Export selected range** in a database toolbar to export the calendar's selected dates with the current source and search filters. Channels export checked rows, or all matching channel rows when none are checked. Channels download as raw CSV; logs and events download as JSON Lines (`.jsonl`). Exports include all matching pages in the selected range, regardless of the rows currently visible or loaded.

The shared [export progress popup](Telemetry%20Exporter.md#export-a-visible-range) shows preparation and download progress and provides **Cancel export**. It stays open until explicitly closed; outside clicks and Escape do not dismiss it. Reloading or disconnecting stops remaining export work.

For any combination of channels, logs, and events from a graph's visible range, pause [Telemetry](Telemetry%20Exporter.md#export-a-visible-range) and use its export checkboxes.

For reusable selections or a combined export, create a [dataframe from history](DataFrames.md#group-existing-history). [ARGUS Events](ARGUS%20Events.md) explains event actions; [Logs](Logs.md) explains streams and sessions.

## Delete recordings

Choose the database's **Delete recordings** control after selecting a range and any channel/node filters. The preview reports the records eligible for deletion and those protected by other dataframes. Including shared recordings can affect those frames; review the affected-frame list before applying it.

Deletion applies to recorded data on this engine. Live channels, task configuration, and a remote source's original recordings remain separate. A completed removal can still report that disk-space reclamation is pending.

For automatic cleanup, use **Settings → Engine → History and recording**. Channel, event, and log databases have separate age and storage limits. See [Settings](Settings.md#save-and-apply-changes).
