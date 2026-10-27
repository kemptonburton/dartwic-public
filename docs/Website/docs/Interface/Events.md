---
summary: Investigate conditions, acknowledge events, and respond to prompts and holds.
created: 2026-08-03T15:41
updated: 2026-10-26T21:52
---

Events draw attention to conditions that need investigation or a response. Open **Events** or the **Events Board**; the bottom event bar also highlights aborts, holds, and prompts.

![ARGUS event board in a connected development workspace.](../_attachments/argus-events.jpg)

# Investigate an event

Read the title, description, and suggested resolution. Check the source, node, and related channels to understand what happened. **Trigger Origin** identifies what fired a declared event; **Definition Origin** opens its DCode declaration.

A graph opened from recorded details starts paused around the occurrence. Choose **Show realtime** to follow current readings. Diagnostic events also offer **Open diagnostics** for the supporting measurement.

Use filters for node, type, status, source, text, session, or time. An item leaving the active board can still have recorded history.

# Event actions

| Action | Result |
| --- | --- |
| Acknowledge | Records that you have seen it. |
| Resolve | Finishes the event once its firing condition or heartbeat has stopped. |
| Silence | Removes it from the active board. |
| Respond | Submits the answer requested by a prompt. |
| Release hold | Releases the specific hold represented by the event. |
| Delete | Removes it through the event's deletion lifecycle. |

Available actions depend on the event's type and state. Resolving a new event also acknowledges it. A prompt retains its submitted answer and recorded responder; older records may have only a client ID.

Acknowledging or silencing an event does not clear its trigger or change equipment. A released task hold permits execution to resume; check the task's state afterward.

# Firing status and event history

**Firing** describes the trigger condition. **Board presence** describes the operator-facing event. A condition can remain true after the event has been silenced, and an event can await resolution after firing ends.

The board's **Last** column is the last accepted report of that event. A condition can stay firing without another report, so **Last** may show an earlier time while its status still says firing. Repeated reports during one firing update **Last** and the detection count without creating another occurrence. A later firing after the current one ends creates another occurrence.

An abort label alone does not define a shutdown sequence. The device or automation supplies that response. Confirm related feedback after acting.

Open **Data → Databases** or a saved dataframe for retained events. [Telemetry Graphs](Telemetry%20Graphs.md#compare-events-and-logs) places occurrences beside measurements. These views read recordings held by the queried Engine.

For event production, firing channels, and lifecycle rules, see [Events and Logs](../Engine/Events%20and%20Logs.md).
