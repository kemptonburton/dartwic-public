---
summary: Read engine, plugin, and DCode output by node, stream, session, and time.
created: 2026-10-04
updated: 2026-10-20T18:59
---

ARGUS logs hold text output from the engine, plugins, scripts, and connected sources. A log record preserves its timestamp, stream, process session, text, and supplied severity or channel reference. Use logs to investigate execution details; use [ARGUS events](ARGUS%20Events.md) for conditions with acknowledgement, prompts, holds, or resolution.

Log lines show local time with millisecond precision. When the loaded records or selected range include a day other than today, each line also shows its date as `YYYY-MM-DD`. This applies to node boards, telemetry, databases, and dataframe history, including multiline output.

## Read current output

Open **Logs** directly below **Events** in the resource sidebar. Select a stream with the scrollable tabs, which also show unread warning and error indicators. When the tabs overflow, use the adjacent search menu to find a stream. The filter button controls severity and output; use the calendar picker to browse a historical time range or session. Its **Calendar** and **Session** tabs keep these selection modes separate; choose dates and times or one session, then select **Apply** in the footer. The **Follow live logs** button returns to current output. Node boards also provide a log view scoped to their node. A stream identifies the source, such as Engine, DARTWIC Builder, or a plugin. A process session groups output from one engine run; restarting the engine creates another session.

Follow the newest records while watching startup or a test. Scrolling back lets you inspect earlier output; the down-arrow returns to current output. Search and severity filters narrow what is displayed. A log line marked as an error does not by itself create an actionable ARGUS event.

**Project → Builder logs** and script activation detail panes use this same viewer, scoped to the connected engine's **DARTWIC BUILDER** stream. They show compiler output across builds, with script paths in the text. An empty Builder stream stays empty rather than displaying another stream. Activation success or failure remains in the action row; [Builder reports](../Engine/DARTWIC%20Builder.md#inspect-builder-through-tempest) provide structured stage and binding details.

## Read recorded output

Open **Data → Databases → ARGUS Logs** for a historical range. Select the origin node, stream, session, and filters needed for the investigation. This opens the same Logs viewer with **Recorded only** enabled. It reads locally retained recordings without subscribing to incoming log records. Records load in pages; the shared calendar shows the selected dates, recorded-content days with blue dots, and loaded days with a blue outline. Hover or focus the footer info icon to see the selected range, loaded coverage, and timestamps of the lines currently on screen. Scrolling updates the visible range without changing the selection.

In [Telemetry Exporter](Telemetry%20Exporter.md), enable **Logs** to review text alongside measurements. Enabling a history board freezes the current graph window; the graph then controls its range. A dataframe's saved log selection can restrict the node, stream, or related channels.

Readable `.log` files also live in the local engine instance's ARGUS runtime directory, arranged by node, session, and stream. The indexed files beside them support queries and peer sharing. [Workspace layout](../Getting%20Started/Tracking%20a%20Project%20in%20GitHub.md#directory-example) shows where that runtime lives.

## Write script or plugin logs

Inside an executable DCode body:

```dcode
log("test_run", "Starting pressure check")
log_warning("test_run", "Pressure sample is stale")
log_error("test_run", "Device read failed")
```

Native C++ DCode requires a literal stream name; the message can be an expression that builds a string. The [periodic-task example](../DCode/Writing%20Periodic%20Tasks.md) logs a skipped count and lateness together. Formatting and logging can allocate, so keep diagnostic output out of the normal repeated control work. See the [DCode log reference](../DCode/Reference/DCode%20Functions/function-log.md) for the supported arguments. An engine plugin uses [SDK_API::writeLog](../Plugins/Reference/Engine/Logs/SDK_API-writeLog.md).

An unavailable log view or log-write error is different from a quiet stream. Check the reported error and [Diagnostics](Diagnostics.md) when records stop arriving.
