---
summary: Plot signals, navigate live and recorded ranges, and compare events and logs.
created: 2026-10-24
updated: 2026-10-30T16:00
---

Open **Telemetry** in the left sidebar to plot channel measurements and commands against time. Compare signals live, review recorded tests, and export their data.

![](_attachments/Pasted%20image%2020261030145613.png)

Schematic and side-panel graphs share the same graph code and similar controls; this guide covers the Telemetry resource.

# Graph Controls

Choose **Add series** in the legend or drop a channel onto the graph. Each series is one signal; set its color and Y axis in the legend. Use separate axes for different units.

Drag to pan, scroll to zoom, and hover to compare values at a time. Use the axis locks to keep a numerical scale fixed.

| Control                         | Use                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Realtime / Historical           | Follow incoming values or pause to inspect recordings.                                                                                     |
| Fit range                       | Bring the loaded data into view.                                                                                                           |
| Fit to dataframe                | Fit the selected run's full time range; available with a dataframe selected.                                                               |
| Measure                         | Compare two points on the plot.                                                                                                            |
| Show commanded by (fingerprint) | Show each sample's writer in tooltips, separate from [current control authority](../Engine/Channels%20and%20Control.md#control-authority). |
| Settings                        | Set preview bucketing, query timeout, and label formatting; inspect query statistics.                                                      |
| Window duration                 | Set how much time the graph displays.                                                                                                      |
| Calendar                        | Choose dates and start/end times for recorded history.                                                                                     |
| Export telemetry                | Export channels, events, and logs for the visible time range.                                                                              |
| Show ARGUS events / logs        | Show recorded activity aligned with the graph.                                                                                             |
| Show dataframes                 | Browse saved runs and their channels alongside the graph.                                                                                  |
| Viewer layout (bottom bar)      | Choose the number of graph rows and columns.                                                                                               |

Inside **Settings**, **Bucketing** controls the preview point count, **Timeout seconds** limits how long a query can wait, and **Display format** includes or hides the **Node**, **Channel name**, and **Field** in labels. The readouts show query duration, series count, returned points, raw points, and whether the preview was bucketed.

For the duration in the graph toolbar, you can type a time span and press **Enter**. Plain numbers mean seconds; suffixes identify the units, so you do not need to convert minutes or hours yourself.

| Enter | Time shown |
| --- | --- |
| `1` or `1s` | 1 second |
| `1m` | 1 minute |
| `1h` | 1 hour |
| `1m 30s`, `1.5m`, or `1:30` | 1 minute, 30 seconds |
| `1:02:03` | 1 hour, 2 minutes, 3 seconds |

The field also accepts `ms` for milliseconds and words such as `seconds` or `minutes`. It formats the result automatically: `60` or `1m` displays as `1:00`, and `1h` as `1:00:00`. Press **Escape** to cancel an edit.

# View and Save Graphs

You can add more rows and columns of graphs to show more data, and if you like a view you have built, you can save it.

Choose the settings icon in the bottom right and configure **Rows** and **Columns**. Each graph has its own channels and time range. Drag a graph's bottom handle onto another to rearrange them.

![](_attachments/Pasted%20image%2020261030150303.png)

Choose **Save view** in that bar, enter a name, and save the current graph arrangement, series, windows, and graph settings for everyone using the workspace. Select a saved view from the tabs to open it. Every graph starts in realtime when a saved view opens; a historical time range or selected dataframe is not saved. After changing a selected view, choose **Apply** to update its shared snapshot. **Save view** creates a separate named snapshot. To remove the selected shared view, choose the trash icon beside Save and confirm. The current graphs stay open as an unsaved view.

![](_attachments/Pasted%20image%2020261030150123.png)

# Live Telemetry

**Realtime** follows incoming values in a moving window. Set its duration in the toolbar. Pause to inspect a transition, then return to realtime to follow new readings. Pausing does not stop acquisition or recording; see [Live Telemetry](../Engine/Recording%20and%20Telemetry.md#live-telemetry).

![](_attachments/Pasted%20image%2020261030150433.png)
# Historical Views

Pause the graph, open the calendar, choose dates and start/end times, and apply the range. Pan or zoom to inspect a transition; the graph queries recordings for the displayed period.

![](_attachments/Pasted%20image%2020261030150514.png)

In **Settings → Bucketing**, **Auto** reduces preview points to suit the graph, **Off** requests raw points, and **Custom** sets a point cap. Raw exports are unaffected. Gaps indicate missing samples, not zeros. See [Historical Queries](../Engine/Recording%20and%20Telemetry.md#historical-queries) for recording limits and query behavior.

# Export Data

Enable **Show ARGUS events**, **Show ARGUS logs**, and **Show dataframes** to combine three Gantt tracks beneath the graph: event activity, log activity, and saved run ranges. All three share the graph's time axis, so you can compare them with channel changes. Opening events or logs pauses live viewing.

The **blue outlines and shading** on each track show the range of records currently loaded into its panel. Activity outside the blue range may still have records available to load; the highlight does not limit a full-range export. Hover a track for a summary or click an entry to inspect it.

Clicking a dataframe in **Data → Dataframes** opens its saved range here. When selecting another dataframe within Telemetry, use **Fit to dataframe** to fit its whole run before exporting. See [Dataframes](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#dataframes) for creating them.

![A recorded run with channel traces, event intervals, and log output.](../Engine/_attachments/Pasted%20image%2020261029010151.png)

Pause, open **Export telemetry**, check **Channels**, **Events**, and **Logs** to include all three, then choose **Export visible range**. This exports matching recordings across the full X-axis range, including unloaded records. Channels use CSV; events and logs use `.jsonl`. **Include commanded by** adds sample writers.

Keep the view connected until export finishes. For whole-dataframe ZIP exports and other export options, see [Export Formats](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-formats).
