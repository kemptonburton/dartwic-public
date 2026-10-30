---
summary: Plot signals, navigate live and recorded ranges, and compare events and logs.
created: 2026-10-24
updated: 2026-10-29T18:29
---

If you want to see how pressure rose during a test, a graph is more useful than a single current number. Telemetry graphs plot **channels**, the named signals holding measurements or commands, against time. You can compare them with events and logs from the same period. Open **Telemetry**, or select channels in Channels and use their graph action.

![A recorded run with channel traces, event intervals, and log output.](../Engine/_attachments/Pasted%20image%2020261029010151.png)

# Live Telemetry

While filling a tank, you might graph pressure beside valve position to watch how the system responds. Keeping related signals together makes it easier to spot a change and compare when it happened.

Add the signals you want to compare. Each channel's plotted trace is a **series**. The vertical **Y axis** gives its numerical scale; use separate axes for pressure and valve position so their different units and ranges remain readable. Show or hide series and hover the plot to compare values at one time.

**Realtime** follows a moving window. Pause to inspect a transition; return to realtime to follow incoming readings again. Pausing the graph does not stop acquisition or recording. For the difference between live snapshots and recorded measurements, see [Live Telemetry](../Engine/Recording%20and%20Telemetry.md#live-telemetry).

## Show Who Wrote a Value

If a command changed unexpectedly, knowing which task or operator wrote that particular point can help explain it. This is separate from who has control of the channel now.

In the telemetry resource, enable the **BY** button (**Show commanded by**) to include the writer in realtime and historical graph tooltips. Attribution belongs to the selected point, so an older point keeps its original writer after another task writes the channel. Missing attribution is shown as **Unavailable**. This identifies the recorded writer, not current control ownership; for periodic snapshots it is the writer associated with the cached value.

The button starts off. Its setting is remembered globally within this Interface and shared by its telemetry resources. It does not change schematic or channel-panel tooltips.

See [Control Authority](../Engine/Channels%20and%20Control.md#control-authority) for the distinction between last writer, owner, and active controller, and [Channel Recording](../Engine/Recording%20and%20Telemetry.md#channel-recording) for recorded samples.

## Side-panel and Schematic Graph Controls

When a graph is embedded in a channel panel or schematic, you may want to scroll the surrounding view without accidentally changing the plot. These smaller graphs start with panning and wheel zoom locked for that reason. Click the lock icon to unlock navigation, then drag to pan or scroll to zoom. Lock it again to scroll the surrounding panel normally.

# Historical Queries

If a warning appeared during the fill, return to that period to inspect the pressure rise and nearby activity. Recorded history lets you review the transition at your own pace while the system continues running.

1. Add channels, pause the graph, and choose the dates and start/end times.
2. Optionally select a saved dataframe for the run.
3. Refresh the query and zoom into the transition.

Enable **Events** or **Logs** to review activity in the same range; this pauses a live graph. Moving or zooming updates those panels. Select an event for details or read the nearby log lines.

Long recordings can contain more samples than a graph can usefully draw. **Bucketing** summarizes them into fewer plotted points to keep the preview manageable. **Auto** fits the preview to the graph; **Off** requests raw points, and **Custom** sets a point cap. This affects the preview, not the raw export. See [Historical Queries](../Engine/Recording%20and%20Telemetry.md#historical-queries).

A signal can retain its last number after its source stops updating. **Stale** means it has passed its configured freshness timeout; an unavailable source cannot supply a current reading. Gaps in the graph are missing samples, not zeros. Check dates, filters, recording policy, and [recording diagnostics](../Engine/Diagnostics%20and%20Troubleshooting.md#rapid) if expected history is missing.

# Saved Ranges and Exports

Once the graph is paused, choose **Export telemetry**, check **Channels**, **Events**, and/or **Logs**, then **Export visible range**. This exports recorded history across the full X-axis range, including records not yet loaded into the preview. Channels use CSV; events and logs use `.jsonl`. Enable **Include commanded by** in the export menu to add the writer beside each channel value. This separate preference also defaults off and is remembered within this Interface.

To keep the whole run for later review, save its range and filters as a [dataframe](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#dataframes-from-recorded-history). The [data guide](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-formats) covers export selection, formats, and cancellation.
