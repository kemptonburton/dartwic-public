---
summary: Save runs, browse recorded data, and choose what to export or delete.
created: 2026-08-03T15:41
updated: 2026-10-30T16:04
---

Open **Data** in the left sidebar to browse recordings under **Databases**, or create and reopen named runs under **Dataframes**. You can graph, export, and delete recorded data here; other resources also provide exports.

![](_attachments/Pasted%20image%2020261030155612.png)

# Recorded Data

Choose a database for the information you want to review:

| Database | Contents |
| --- | --- |
| RAPID Channels | Numeric samples and timestamps. |
| ARGUS Events | Warnings, prompts, and other events, including when they were active and how operators responded. |
| ARGUS Logs | Output by stream and Engine session. |

![The database catalog with recorded events open beside it.](../Engine/_attachments/Pasted%20image%2020261029010108.png)

The Engine populates these databases automatically. Check [channel recording settings](../Engine/Recording%20and%20Telemetry.md#channel-recording) before a test; starting a dataframe does not enable recording. [Events and logs](../Engine/Recording%20and%20Telemetry.md#event-and-log-recording) have their own recording paths.

# Historical Queries

Open a database, choose its calendar range and filters, and select a result. For measurements, check channels and choose **Review selected channels** to open a graph. Events and logs also offer Engine-session ranges where available.

![](_attachments/Pasted%20image%2020261030155727.png)

Queries read recordings saved on the connected Engine, including remote data recorded here. You can query and export while it runs. See [Historical Queries](../Engine/Recording%20and%20Telemetry.md#historical-queries) for recording and preview behavior.

# Dataframes

A **dataframe** names a run and saves its time range, channels, and filters for later review or export. It references existing recordings rather than copying them.

## Live Run Dataframes

Choose **New dataframe → Start now**, name the run, select channels, and set events/logs to **All**, **Related channels**, or **Off**. Choose **Start dataframe**, run your procedure, then **Stop dataframe**. These controls mark the range without starting tasks or changing recording settings.

![](_attachments/Pasted%20image%2020261030160420.png)

## Dataframes from Recorded History

Choose **New dataframe → From history**, set the name, range, channels, and filters, then **Create dataframe**. An empty channel list includes all channels; **Related channels** matches events/logs explicitly linked to those channels.

Click a dataframe to open its saved range in the **Telemetry** resource. Check or drag channels to plot them, then use [Export telemetry](Telemetry%20Graphs.md#export-data) to export channels, events, and logs for the range you are viewing. Use **Fit to dataframe** first to include the whole run.

![](_attachments/Pasted%20image%2020261030160345.png)

## Start a Dataframe from DCode

To mark a run from automation, create a script in [DCode Editor](DCode%20Editor.md), activate it, then start **dataframe_demo** in Tasks. This example saves a ten-second range:

```dcode
task_sequence dataframe_demo:
    frame_id = startDataFrame("Example run", {})
    wait(10)
    stopDataFrame(frame_id)
```

After completion, find **Example run** under **Data → Dataframes**. In your own procedure, start the frame before the work and stop it afterward using the returned ID. See [startDataFrame](../DCode/Reference/DCode%20Functions/function-startDataFrame.md) for channel and event/log filters, and [stopDataFrame](../DCode/Reference/DCode%20Functions/function-stopDataFrame.md) for closing it.

# Export Formats

Exports are available in **Data**, **Telemetry**, **Events**, **Logs**, and **Node Board**. Channel samples use CSV; events and logs use JSON Lines (`.jsonl`). Dataframes bundle their contents in a ZIP.

| Starting point | Action and output |
| --- | --- |
| Data → Databases | Apply a calendar range, then use the download menu's **Selected range**, **Loaded range**, or **Visible range**. Checked channels are exported, or all matching channels if none are checked. |
| [Telemetry](Telemetry%20Graphs.md#export-data) | Pause, choose **Export telemetry**, check **Channels**, **Events**, and/or **Logs**, then **Export visible range**. |
| [Events](Events%20and%20Logs.md#export-events) / [Logs](Events%20and%20Logs.md#export-logs) | Apply a calendar range, then export **Selected range**, **Loaded range**, or **Visible range** from that resource. |
| Node Board | Export a **Current board** snapshot or **Selected events**. |
| Data → Dataframes | Select frames and choose **Export selected dataframes** for a ZIP per frame containing channel CSV, events, logs, and a manifest. |

Range exports include matching history beyond the loaded preview. Board snapshots contain the current items. An active dataframe can be exported; its end time is fixed when export starts.

## Export a Visible Range

The [telemetry export](Telemetry%20Graphs.md#export-data) uses the graph's full X-axis range and raw recordings, regardless of preview bucketing. **Include commanded by** adds sample writers to its CSV. Keep the view connected until completion; **Cancel export** stops remaining work.

# Retention and Deletion

**Retention** limits recordings by age or size. Removing a dataframe keeps its recordings; deleting recordings can affect several frames. Frames do not protect history from cleanup, so export runs you need to keep.

![Separate channel, event, and log retention settings.](../Engine/_attachments/Pasted%20image%2020261029010240.png)

Configure **Settings → Engine → History and recording**; see [Recording and Telemetry](../Engine/Recording%20and%20Telemetry.md#dataframes-retention-and-deletion) for storage and cleanup details.
