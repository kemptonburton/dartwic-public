---
summary: Create traceable events and separate firing state from operator lifecycle.
updated: 2026-10-16T12:40
created: 2026-09-04T17:13
---

ARGUS records events that need operator attention or later investigation. Producers include the engine, DCode, plugins, and TEMPEST operation observations.

ARGUS also stores named text log streams for process output and messages that do not need acknowledgement or resolution. Use [Logs](../Interface/Logs.md) for those streams. Events and logs can be viewed with recorded channels in [Data](../Interface/Recorded%20Data.md) or included in a timed [dataframe](../Interface/DataFrames.md).

## Choose an event form

| Need | Use |
| --- | --- |
| Standalone message, warning, or error | DCode event functions or the plugin event SDK. |
| Stable identity and condition-driven automation | A [DCode event declaration](../DCode/Events.md). |
| Operator input | A prompt with an explicit answer type. |
| A resumable operator wait | A hold and the corresponding release workflow. |
| Historical investigation | ARGUS event queries with source/time filters. |

An event's type or title does not itself implement equipment control. An abort event must be paired with explicit reaction logic if it should stop or change hardware.

## Make events useful

Give the event a clear title, a description of the condition, and a resolution that explains the next operator action. Include related channel references and system/subsystem context. The engine records origin information such as node, task/loop, file, and line when available.

Declared event keys are stable identities; two declarations should not reuse a key for unrelated conditions. Ad hoc functions do not bind to a declaration merely because their titles match.

## Firing and lifecycle

A declaration's generated `_firing` channel describes its live condition or one-shot heartbeat. Its event-key channel describes presence on the active board. Acknowledgement, silencing, and resolution are separate from the measured condition.

DCode commits firing changes synchronously before recording the event payload, enabling inline `on_firing:` reactions. Event publication, interface refresh, and persistence remain asynchronous. See [Execution and Timing](Execution%20and%20Timing.md).

ARGUS submits event and occurrence changes for recording while an event is active; resolution is not required before history is written. Publication to the interface is a separate bounded path. If it drops updates, ARGUS counts them and sends a history-refresh notice after older queued updates drain. Check [Diagnostics](../Interface/Diagnostics.md) for recording backlog and publication loss separately.

One engine session admits up to 16,384 distinct event identities. A producer that attempts a new identity after that limit receives an explicit error before the event changes the active board; already admitted identities can continue to recur. The limit bounds session bookkeeping and does not remove recorded history. Monitor `session_identity_ids_admitted` and `rejected_identity_admissions_total` in ARGUS diagnostics when generating many distinct event titles or keys.

Operators can acknowledge a firing event. Resolution waits for the maintained condition or one-shot heartbeat to stop. A later trigger can reopen the same keyed event.

## Query and act

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

Use the generated [Events operation reference](Reference/TEMPEST/Operations/Events.md) for query fields and lifecycle actions. [ARGUS Events in the interface](../Interface/ARGUS%20Events.md) explains the board, details, prompts, and holds.
