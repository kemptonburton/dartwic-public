---
summary: Save runs, browse recorded data, and choose what to export or delete.
created: 2026-08-03T15:41
updated: 2026-10-29T18:30
---

Open **Data** to browse the connected Engine's recordings, save a named run, or download its measurements, events, and logs. A dataframe saves a time range and filters; it does not copy the underlying recordings.

# Recorded Data

After a test, you might want to see how pressure changed, when a warning appeared, or what a driver reported. The **Databases** tab gives you a starting point for each kind of recorded information:

| Database | Contents |
| --- | --- |
| RAPID Channels | Numeric samples and timestamps. |
| ARGUS Events | Warnings, prompts, and other events, including when they were active and how operators responded. |
| ARGUS Logs | Output by stream and Engine session. |

![The database catalog with recorded events open beside it.](../Engine/_attachments/Pasted%20image%2020261029010108.png)

# Historical Queries

To investigate yesterday's test, ask for the saved records from that period rather than watching incoming values. Choosing a time range and filters limits the request, called a **query**, to the information you want to review.

Open a database, choose the calendar range, and apply channel, node, stream, or session filters. Select results to inspect them; **Review selected channels** opens a graph. These views read history saved on this Engine, including remote data recorded here.

Recorded data can be exported while the Engine is running. A live value may arrive before it is saved; if recent history is missing, check [Recording and Delivery Loss](../Engine/Recording%20and%20Telemetry.md#recording-and-delivery-loss).

# Dataframes

If you run several fill tests in an afternoon, finding each one by its timestamps can become tedious. A dataframe lets you name a run and keep its time range, channels, and filters together, so you can reopen or export that test later.

## Live Run Dataframes

When you are about to run a test, mark its beginning and end as you go:

1. Open **Data → Dataframes → New dataframe** and choose **Start now**.
2. Name the run, optionally select channels, and set events/logs to **All**, **Related channels**, or **Off**.
3. Choose **Start dataframe**, run the procedure, then **Stop dataframe**.

Start and Stop mark the range; they do not start tasks or change recording policies. Open the saved frame to check its range and contents. A frame interrupted by an Engine restart shows **Interrupted**.

## Dataframes from Recorded History

If the test has already happened, you can create the same saved view by selecting its recorded time range.

Choose **New dataframe → From history**, set the name, range, channels, and filters, then **Create dataframe**. An empty channel list includes all channels; **Related channels** includes event/log records explicitly linked to the selected channel names.

![A dataframe's channel list, traces, events, and logs.](../Engine/_attachments/Pasted%20image%2020261029010151.png)

Open the frame and check or drag channels to plot them. Narrow the graph to inspect a transition, or export the frame to share the complete saved range.

# Export Formats

Choose where to export based on what you want to share: a database selection, the transition you are inspecting on a graph, or an entire named test.

Channel CSV files hold rows of timestamped numbers you can open in a spreadsheet. Event and log JSON Lines files (`.jsonl`) hold one structured record per line for analysis tools. A ZIP bundles the files from a dataframe into one download.

| Starting point | Action and output |
| --- | --- |
| Database | **Export selected range** uses its calendar range and filters. Channels use raw CSV; events/logs use JSON Lines (`.jsonl`). Checked channels are exported, or all matching channels if none are checked. |
| Paused telemetry graph | **Export telemetry → Export visible range** uses its full X-axis range and selected data types. |
| Dataframe list | Select frames, then **Export selected dataframes** for a ZIP per frame with channel CSV, events, logs, and a manifest. |

Exports include matching history that has not loaded into the preview. You can export an active dataframe; its end time is fixed when export starts.

## Export a Visible Range

If you have zoomed in on a pressure spike and want to share just that part of the test, use the graph's current time range for the export.

Pause the graph, open **Export telemetry**, check **Channels**, **Events**, and/or **Logs**, then **Export visible range**. Preview bucketing does not reduce raw exports. CSV leaves missing samples empty rather than filling them with zeros.

Keep the view and connection open until the download completes. **Cancel export** stops remaining work; files already downloaded remain. Read any error before retrying.

# Retention and Deletion

Recordings accumulate as you operate the system. **Retention** settings limit how much history the Engine keeps by age or storage size, so you can manage disk use. Export runs you need to keep before their underlying recordings are removed.

Removing a dataframe keeps its recordings. Deleting recordings removes underlying history and can affect several frames. Frames do not protect history from automatic cleanup.

![Separate channel, event, and log retention settings.](../Engine/_attachments/Pasted%20image%2020261029010240.png)

Configure limits in **Settings → Engine → History and recording**. For recording policies, storage, and cleanup behavior, see [Recording and Telemetry](../Engine/Recording%20and%20Telemetry.md#dataframes-retention-and-deletion).
