---
summary: Investigate events, respond to prompts and holds, and read live or recorded logs.
created: 2026-08-03T15:41
updated: 2026-10-29T18:29
---

When a device disconnects or pressure exceeds a limit, an **event** brings the condition to the operator's attention and tracks how it is handled. A **log** preserves timestamped text, such as the driver's connection error. **ARGUS** is the Engine service that manages and records both, so you can review them alongside channel measurements.

# Events

Open **Events** to search and filter the event list. The **Node Board** keeps a node's activity beside your work; the bottom bar also opens aborts, holds, and prompts.

![The event list with a selected warning, related channels, and operator actions.](../Engine/_attachments/Pasted%20image%2020261028143012.png)

Select an event and read its description, suggested resolution, source, and related graphs. Follow **Trigger Origin**, **Definition Origin**, or **Open diagnostics** when available to investigate its source.

## Event Types

Some events simply tell you that something happened, while others need a response before work can continue. The type helps you decide whether to read the message, investigate a problem, or answer a request.

Messages report information; warnings and errors highlight problems. Aborts identify conditions needing the application's abort response. Holds wait for release, and prompts wait for an answer. The type alone does not define an equipment shutdown; see [Event Types](../Engine/Events%20and%20Logs.md#event-types).

## Event States and Actions

Suppose a pressure warning appears during a fill. You want the other operators to know you have seen it while you investigate, even if the pressure is still high. Later, when the condition has cleared and you have finished checking it, you can mark it resolved. An event's state tracks that progress; its actions let you acknowledge it, finish handling it, or provide a response.

The warning first appears as **New**. Choosing **Acknowledge** changes it to **Acknowledged**, showing that someone has seen it. Its **firing** indicator tells you whether the condition is still active; acknowledging high pressure does not make the pressure fall.

Other labels help you recognize older or uncertain information. **Stale** identifies an unfinished event from an earlier Engine session. **Firing unknown** means the Interface cannot establish the condition's current state because its owner is unavailable.

| Action | Use |
| --- | --- |
| **Acknowledge** | Mark the event as seen. |
| **Resolve** | Finish handling a condition after firing stops. |
| **Silence** | Hide it from the board; the condition can continue. |
| **Respond** | Submit a prompt's answer. |
| **Release hold** | Release the waiting workflow, then check its task state. |

Use the details panel's actions, or select several events for the bulk toolbar. Actions depend on type, state, and permissions. For the complete lifecycle, see [Event States](../Engine/Events%20and%20Logs.md#event-states) and [Event Actions](../Engine/Events%20and%20Logs.md#event-actions).

## Query Events

After a test, you may need to find a warning that has already left the active board or see how often it returned. Event history keeps those records and the operator's responses. Each period of firing is an **occurrence**, so repeated warnings can be reviewed as part of the same event.

Open **Data → Databases → ARGUS Events**, set the calendar range and filters, then select an event to review its recorded occurrences and responses. History is recorded while events are active; you do not need to resolve them before reviewing or exporting saved records.

![ARGUS Events opened from the database catalog.](../Engine/_attachments/Pasted%20image%2020261029010108.png)

Choose **Export selected range** in the database toolbar to download the filtered event history as JSON Lines (`.jsonl`). For events and channel samples together, pause [Telemetry](Telemetry%20Graphs.md#saved-ranges-and-exports) and use **Export telemetry**, or export a [dataframe](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-formats).

# Logs

Logs help explain startup, device errors, and script output. An error log does not automatically create an actionable event.

## Log Streams and Sessions

When a device fails to connect, its driver's output is usually more useful than every message from the whole system. Streams separate output by source, while sessions help you find the Engine run when the problem occurred.

Open **Logs**, select a stream such as **Engine** or a plugin, then search or filter by severity.

When the stream tabs overflow, open their list to see the same unread warning and error icons shown on the tabs. Use the filter beside the list search to show only streams with unread errors or warnings.

![Timestamped Engine output in the log viewer.](../Engine/_attachments/Pasted%20image%2020261028142931.png)

Use **Calendar → Calendar or Session**, select the period, and **Apply** to inspect earlier output. **Follow live logs** returns to incoming lines; the down-arrow jumps to the newest records. See [Log Streams and Sessions](../Engine/Events%20and%20Logs.md#log-streams-and-sessions) for how output is organized.

## Action and Builder Logs

If a native DCode script fails to load, the problem may be in the compilation step that prepares it to run. **Builder** performs that step, and its log preserves the compiler's explanation.

**Project → Builder logs** and script activation details show **DARTWIC BUILDER** output. Read compiler messages alongside the activation result, then follow file/line links back to the [editor](DCode%20Editor.md).

## Recorded Logs

Use recorded logs when the output you need is no longer in the live view, such as startup messages from this morning or an error from a previous test. Date, session, and stream filters help narrow the search.

Open **Data → Databases → ARGUS Logs**, select node, stream, session, and dates, then inspect the results. **Recorded only** reads saved output without following new lines.

Choose **Export selected range** to download matching logs as `.jsonl`. Export is available for retained history, including earlier sessions; you do not need to wait for the current Engine run to end. To compare logs with signals, enable Logs in a paused telemetry graph and [export its visible range](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-a-visible-range).

For recording, retention, and missing history, see [Event and Log Recording](../Engine/Recording%20and%20Telemetry.md#event-and-log-recording) and [Diagnostics](../Engine/Diagnostics%20and%20Troubleshooting.md#argus).
