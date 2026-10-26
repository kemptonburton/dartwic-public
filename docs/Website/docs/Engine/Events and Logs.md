---
summary: Understand event conditions, operator lifecycle, log streams, and recorded evidence.
created: 2026-09-04T17:13
updated: 2026-10-25T15:38
---

An **event** is a named condition or occurrence that someone may need to investigate or act on: a device disconnect, a pressure limit, a prompt, or a task hold. A **log** is timestamped text explaining what the system did.

ARGUS is the Engine component that manages both. For a failed device read, a log can contain the transaction error while an event gives the operator a problem to acknowledge and follow through recovery. DCode, plugins, and Engine services can produce them.

Use [Events](../Interface/Events.md) and [Logs](../Interface/Logs.md) for the operator views. Recorded events and logs can be compared with channels in [Data](../Interface/DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md).

# Choose an event form

Choose the form around the response you need. A prompt asks for an answer; a hold represents work waiting to be released. A declared DCode event gives a condition a reusable identity and reaction logic.

| Need | Use |
| --- | --- |
| Standalone message, warning, or error | DCode event functions or the plugin event SDK. |
| Stable identity and condition-driven automation | A [DCode event declaration](../DCode/Events.md). |
| Operator input | A prompt with an explicit answer type. |
| A resumable operator wait | A hold and the corresponding release workflow. |
| Historical investigation | ARGUS event queries with source/time filters. |

An event's type or title does not itself implement equipment control. An abort event must be paired with explicit reaction logic if it should stop or change hardware.

# Make events useful

Give the event a clear title, a description of the condition, and a resolution that explains the next operator action. Include related channel references and system/subsystem context. The engine records origin information such as node, task/loop, file, and line when available.

Declared event keys are stable identities; two declarations should not reuse a key for unrelated conditions. Ad hoc functions do not bind to a declaration merely because their titles match.

# Firing and lifecycle

**Firing** means the trigger is active. **Lifecycle** describes what operators have done with the event, such as acknowledging or resolving it. A pressure warning can remain firing after acknowledgement because the pressure is still high.

A declaration's `_firing` channel follows its condition or timed one-shot trigger. Its event-key channel follows presence on the active board. Acknowledgement and silencing do not clear the measured condition.

DCode commits firing changes synchronously before recording the event payload, enabling inline `on_firing:` reactions. Event publication, interface refresh, and persistence remain asynchronous. See [Execution and Timing](Execution%20and%20Timing.md).

ARGUS submits event and occurrence changes for recording while an event is active; resolution is not required before history is written. Publication to the interface is a separate bounded path. If it drops updates, ARGUS counts them and sends a history-refresh notice after older queued updates drain. Check [Diagnostics](Diagnostics%20and%20Troubleshooting.md) for recording backlog and publication loss separately.

An Engine run admits up to 16,384 distinct event identities. New identities beyond the limit are rejected before changing the board; existing identities can recur and history remains. Monitor `session_identity_ids_admitted` and `rejected_identity_admissions_total` when generating many titles or keys.

Operators can acknowledge a firing event. Resolution waits for the maintained condition or one-shot heartbeat to stop. A later trigger can reopen the same keyed event.

# Query and act

A client can query the active events and use their IDs for supported lifecycle actions. With an already connected client:

```python
response = client.operation("argus/get-active-events", {
    "limit": 100,
    "offset": 0,
})
response.raise_for_error()
for event in response.payload["events"]:
    print(event.get("event_id"), event.get("title"), event.get("status"))
```

Historical queries can filter by node, system/subsystem, type, status, channel, text, session, and time. Event timestamps with an `_ns` suffix are epoch nanoseconds. Do not confuse them with detached-job timestamps, which use milliseconds.

Use the generated [Events operation reference](Reference/TEMPEST/Operations/Events.md) for query fields and lifecycle actions. [ARGUS Events in the interface](../Interface/Events.md) explains the board, details, prompts, and holds.

# Event identity and firing windows

An event identity lets repeated reports describe the same problem. A firing window determines how long a report continues to count as active when no further reports arrive.

ARGUS groups reports by node, title, system, and subsystem. Type, description, and source can change on later reports without creating a new logical event. Each report supplies `separation_seconds`: a positive value ends firing after that quiet period, while zero requires an explicit stop.

Firing ending does not acknowledge, resolve, answer a prompt, or clear a physical fault. Automation should use condition reactions such as DCode `on_firing:`, rather than treating board presence as the sensor condition.

# Log streams and sessions

A **stream** groups output from a source, such as the Engine, Builder, or a plugin. A **session** groups output from one Engine run. Records retain their source timestamp, text, and supplied severity or channel reference, so you can inspect what happened around a failure.

Inside an executable DCode body:

```dcode
log("test_run", "Starting pressure check")
log_warning("test_run", "Pressure sample is stale")
log_error("test_run", "Device read failed")
```

Native C++ DCode requires a literal stream name; the message can be a string expression. Formatting/logging can allocate and should stay out of the normal repeated control path when that path has strict timing requirements. See the [log function reference](../DCode/Reference/DCode%20Functions/function-log.md) and [SDK_API::writeLog](../Plugins/Reference/Engine/Logs/SDK_API-writeLog.md).

Readable `.log` files and indexed query data live under the instance's ARGUS runtime storage. The [Logs guide](../Interface/Logs.md) owns browsing streams, sessions, and retained ranges. Recording backlog or write failure differs from a quiet stream; inspect [diagnostics](Diagnostics%20and%20Troubleshooting.md) when output disappears.
