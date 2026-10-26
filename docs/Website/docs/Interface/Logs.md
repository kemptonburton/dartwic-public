---
summary: Read current and recorded output by node, stream, session, severity, and time.
created: 2026-10-04
updated: 2026-10-24T23:17
---

Logs are text output from the Engine, plugins, and scripts. Use them to follow startup, investigate a failed action, or see what a device or automation reported. [Events](Events.md) provide the separate acknowledgement, prompt, and resolution workflow.

# Read current output

Open **Logs** in the sidebar and choose a stream. A stream identifies a source, such as the Engine, Builder, or a plugin. A session groups output from one Engine run; restarting creates another session.

| Control | Use it to… |
| --- | --- |
| Stream tabs or stream search | Choose the source to read. |
| Search and severity filters | Narrow the displayed output. |
| Calendar → Calendar | Select dates and times, then **Apply**. |
| Calendar → Session | Select a process session, then **Apply**. |
| Follow live logs | Return to incoming output. |
| Down-arrow | Return to the newest records. |

Node boards also offer logs scoped to their node. Lines show local time with millisecond precision, adding a date when the range includes another day.

# Investigate an action

Start with the stream and time around the failure. Open related channels or events when present. An error log is evidence from its producer; it does not automatically create an actionable event.

**Project → Builder logs** and script activation details use the **DARTWIC BUILDER** stream. Check the action's success or failure alongside the compiler output. An empty Builder stream does not fall back to another source.

# Read recorded output

Open **Data → Databases → ARGUS Logs** for retained output. Choose a node, stream, session, and time range. **Recorded only** reads saved records without subscribing to incoming lines.

Records load in pages. The calendar distinguishes selected dates, loaded coverage, and the visible lines; scrolling leaves the selected query dates unchanged. An empty filtered range does not establish that the whole database is empty.

In [Telemetry Graphs](Telemetry%20Graphs.md#compare-events-and-logs), enable **Logs** to compare output with measurements. The [data guide](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#choose-an-export) explains JSON Lines downloads and saved-frame filters.

If expected output stops arriving, inspect the reported error and [Engine diagnostics](../Engine/Diagnostics%20and%20Troubleshooting.md). For producing logs and understanding their storage, see [Events and Logs](../Engine/Events%20and%20Logs.md#log-streams-and-sessions).
