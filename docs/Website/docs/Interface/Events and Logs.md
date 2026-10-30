---
summary: Investigate events, respond to prompts and holds, and read live or recorded logs.
created: 2026-08-03T15:41
updated: 2026-10-30T14:38
---

Events flag conditions that need attention; logs preserve timestamped output explaining what happened. **ARGUS** manages and records both. Open **Events** or **Logs** in the left sidebar, or use their [Node Board views](Node%2C%20Context%2C%20and%20Project%20Board.md#node-activity) beside your main tab.

# Events

Plugins and automation report events such as a disconnected device or high pressure. Use the Interface to investigate the condition and respond. [Engine Events and Logs](../Engine/Events%20and%20Logs.md#events) explains how events are produced and handled.

## Viewing Events

Open **Events** in the left sidebar to see live events and recorded history. Select an event to inspect its details and available actions.

![The Events resource with its event list and selected-event details.](_attachments/Pasted%20image%2020261029225414.png)

Use **Search events** and the filter menu to narrow by severity, type, node, system, subsystem, or status. 

Choose **Calendar → Calendar or Session**, select the period, and **Apply**. The blue dots represent days on which recorded content exists, and the blue outlined section represents the current range that is loaded.

White sections select start and end days with the grey highlighting days in between, and the light grey highlighted day represents the current day.

![](_attachments/Pasted%20image%2020261030000847.png)

![](_attachments/Pasted%20image%2020261030000617.png)

Click an event and scroll its details to read the description, resolution, origins, and graphs. Use its actions to acknowledge or resolve it, answer a prompt, or release a hold. Select several events for bulk actions.

Open **Node Board** near the bottom of the sidebar to keep events beside your main tab; the activity bar also opens aborts, holds, and prompts. See [Node Activity](Node%2C%20Context%2C%20and%20Project%20Board.md#node-activity).

![](_attachments/Pasted%20image%2020261029235109.png)

For saved occurrences and responses, open **Data → Databases → ARGUS Events** and set its range and filters. You can review history while events remain active. See [Historical Queries](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#historical-queries).

![ARGUS Events opened from the database catalog.](../Engine/_attachments/Pasted%20image%2020261029010108.png)

## Event Metadata

These details identify the condition and help you investigate. Availability depends on its producer and recorded history; see [Event Metadata](../Engine/Events%20and%20Logs.md#event-metadata) for exact behavior.

| Detail                     | Meaning                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| Title                      | Name of the condition.                                                        |
| Type / severity            | Purpose and attention level.                                                  |
| Description                | What happened.                                                                |
| Resolution                 | Suggested checks or recovery steps.                                           |
| Node                       | Owning Engine.                                                                |
| System / subsystem         | Grouping, such as propulsion / fuel.                                          |
| State / firing             | Handling progress / whether the condition is active.                          |
| First / last               | First and most recent detection times.                                        |
| Detections                 | Accepted reports of the condition.                                            |
| Occurrences                | Separate firing periods, with recorded timing, session, and detection counts. |
| Trigger Origin             | Source that fired it: task, loop, script/line, module, plugin, or operation.  |
| Definition Origin          | Declaration key and originating node/script if its a DCode declared event.    |
| Channels / graphs          | Related measurements.                                                         |
| References / diagnostics   | Links for investigation.                                                      |
| Response                   | Prompt answer and responder.                                                  |
| IDs / session / timestamps | Identity and timing in history and exports.                                   |
| Automatic acknowledgement  | Producer-configured acknowledgement delay.                                    |
| Firing timeout             | Producer-configured quiet interval before firing ends.                        |

Clicking an event shows its Info Panel on the right, which these metadata fields can be viewed in.

![](_attachments/Pasted%20image%2020261029232140.png)

![](_attachments/Pasted%20image%2020261029232202.png)

The Event Info Panel contains useful information used to react to the event, who may have reacted to the event, or figure out where it came from and what limits may have triggered it.

### Types

The type tells you why an event needs attention.

![](_attachments/Pasted%20image%2020261029232455.png)

| Type | Meaning |
| --- | --- |
| Message | Information or a completed action. |
| Warning | A condition needing attention. |
| Error | A failure or fault. |
| Abort | A condition needing the application's abort response. |
| Hold | A workflow waiting for release. |
| Prompt | A request for a number, text, yes/no, or selected option. |

### States

Handling and firing are separate: acknowledging high pressure does not stop the pressure condition. See [Event States](../Engine/Events%20and%20Logs.md#event-states) for lifecycle details.

![](_attachments/Pasted%20image%2020261029232524.png)

| State | Meaning |
| --- | --- |
| New | Awaiting acknowledgement. |
| Acknowledged | Seen; may still be firing. |
| Resolved | Handling finished after firing stopped; later detections can reopen it. |
| Silenced | Hidden from the active board; may still fire. |
| Deleted | Removed from the event lifecycle; recorded history remains. |
| Responded | Prompt answered. |
| Released | Hold released; check what resumed. |
| Stale | Unfinished event from an earlier Engine session. |

**New active** and **Acknowledged active** indicate firing. **Firing unknown** means the owner's current state is unavailable. **Observed** is a resolved observation record.

### Actions

Available controls depend on type, state, and permissions. They do not themselves prove equipment recovery; see [Event Actions](../Engine/Events%20and%20Logs.md#event-actions).

![](_attachments/Pasted%20image%2020261029232538.png)

| Action          | Result                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Acknowledge     | Mark as seen.                                                                                                |
| Unacknowledge   | Return to New.                                                                                               |
| Resolve         | Finish handling a condition that has stopped firing. Removes the event from the Node Board.                  |
| Unresolve       | Return to Acknowledged without restarting firing. Returns                                                    |
| Silence         | Hide without stopping the condition.                                                                         |
| Unsilence       | Return to Acknowledged.                                                                                      |
| Respond         | Submit a prompt's answer.                                                                                    |
| Release hold    | Release the waiting workflow.                                                                                |
| Delete          | Mark deleted; recorded history remains.                                                                      |
| Resolve locally | Clear a disconnected remote event locally; its owner's state stays unchanged and it may return on reconnect. |

It is best practice to Acknowledge an event once you have read it. Once you diagnose it and resolve the issue, (and it has stopped firing), you can resolve it to remove it from the board.

Never acknowledge an Event without really knowing what triggered it or what the severity may be. You could forget about the occurrence, and that could mean the difference between hardware working when it needs to, and when it does not.

Silencing an event will prevent it from showing up on the board. You can go to the Events resource to unsilence it.

## Export Events

You may want to export events for further analysis outside of DARTWIC. You can export events from the Events resource, the Events Node Board, or the Events Database in the Data Resource. 

Export ranges available are chosen from the selected ranges in the Calendar Picker. Configure your range, then click the Export button adjacent to it, and select a range to start the export. 

**Selected range**, **Loaded range**, and **Visible range**, with the same bounds shown in the calendar's information popup are offered.

A live or unavailable range cannot be exported until it has concrete bounds. Each choice exports matching recorded events and occurrences as `.jsonl`, including results not loaded into the preview. See [Export Formats](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-formats).

![](_attachments/Pasted%20image%2020261030001203.png)

On the Node Board, **Selected events** exports selected items as shown, and **Current board** captures all matching events, including those outside the scroll viewport. Use a calendar range export for recorded occurrence history.

![](_attachments/Pasted%20image%2020261030001254.png)

To include channel samples, use a paused graph's [telemetry export](Telemetry%20Graphs.md#export-data) or export a dataframe.

# Logs

Logs help investigate startup, device errors, and script progress. A **stream** groups output by source; a **session** identifies one Engine run. Open **Logs** to follow incoming output or inspect earlier messages. [Write Logs](../Engine/Events%20and%20Logs.md#write-logs) covers producing output from plugins and automation.

## Viewing Logs

Open **Logs** in the left sidebar and choose an output stream, such as the Engine or a device plugin.

![](_attachments/Pasted%20image%2020261030001408.png)

Select a stream, then use **Search logs** and filters to find the relevant output. The stream list shows unread warning/error icons; its filter can limit the list to streams needing attention.

Use **Calendar → Calendar or Session** and **Apply** to inspect an earlier period. The blue dots represent days on which recorded content exists, and the blue outlined section represents the current range that is loaded.

White sections select start and end days with the grey highlighting days in between, and the light grey highlighted day represents the current day.

![](_attachments/Pasted%20image%2020261030000847.png)

![](_attachments/Pasted%20image%2020261030000617.png)


To watch a driver's output while configuring its module or starting a task, keep its logs open in [Node Board](Node%2C%20Context%2C%20and%20Project%20Board.md#node-activity).

![](_attachments/Pasted%20image%2020261030001646.png)

## Log Metadata

Each record identifies the message, its source, and timing. See [Log Metadata](../Engine/Events%20and%20Logs.md#log-metadata) for the stored format.

| Field | Meaning |
| --- | --- |
| Node (`node`) | Originating Engine. |
| Session (`session`) | Engine run. |
| Stream (`stream`) | Named source, such as a plugin or DARTWIC BUILDER. |
| Output channel (`channel`) | Usually `stdout` or `stderr`, not a measurement channel. |
| Level (`level`) | Usually `info`, `warning`, or `error`. |
| Text (`text`) | Message contents. |
| Sequence (`sequence`) | Position within the node/session/stream. |
| Timestamp (`timestamp_ns`) | Source time, stored as Unix-epoch nanoseconds. |

**Info** gives context, **Warning** flags a problem, and **Error** reports a failure. Logs have no acknowledgement or resolution states. **Live** follows incoming output; **Recorded only** reads saved history.

## Export Logs

You may want to export logs for further analysis outside of DARTWIC. You can export logs from the Logs resource, the Logs Node Board, or the Logs Database in the Data Resource. 

Export ranges available are chosen from the selected ranges in the Calendar Picker. Configure your range, then click the Export button adjacent to it, and select a range to start the export. 

**Selected range**, **Loaded range**, and **Visible range**, with the same bounds shown in the calendar's information popup are offered.

Each choice exports matching recorded output as `.jsonl`, including results not loaded into the preview. See [Export Formats](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-formats).

![](_attachments/Pasted%20image%2020261030002019.png)

You can export while the Engine is running. Keep the view and connection open until completion; **Cancel export** stops remaining work. To include channels, use a paused graph's [visible-range export](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-a-visible-range).
