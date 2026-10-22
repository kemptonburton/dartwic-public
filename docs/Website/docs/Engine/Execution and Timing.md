---
summary: Understand inline calculations, scheduled tasks, and asynchronous delivery.
updated: 2026-10-14T15:07
created: 2026-09-06T14:34
---

A signal can cause work at several different times: when a driver writes it, on the next scheduled task iteration, or when an Interface receives telemetry. Choose the path that matches the behavior you need.

For example, a pressure conversion can run during the measurement update, while a fill controller runs periodically and a graph refreshes later. [Deterministic Automation](Deterministic%20Automation.md) covers choosing and measuring a repeated control path.

## What runs when

| Work | Trigger | Timing boundary |
| --- | --- | --- |
| Calculation attached to a channel being written | A write to that target | Runs inline before the target value is committed. |
| Calculation depending on another channel | An accepted dependency value commit | Runs inline after that commit, before the originating write returns. |
| Populated DCode event `trigger:` | Activation, then dependency commits | Evaluated synchronously; no periodic condition polling. |
| Event `on_firing:` | A change in the generated firing channel | Runs in the firing-channel calculation path. |
| Periodic task or state machine | Scheduled release | Runs on a CAESAR loop at its requested frequency. |
| Driver acquisition or command delivery | Driver-defined polling, callbacks, or workers | Depends on that module and its protocol. |
| Interface channel updates | Telemetry publication and subscription interval | Asynchronous; UI timing does not control engine execution. |
| History recording | Accepted writes and recording policy | Queued and flushed asynchronously. |
| TEMPEST peer delivery | TEMPEST peer publications, transport, and receive handling | Asynchronous across the link. |

## A synchronous limit response

A pressure sample committed locally can immediately evaluate a DCode event condition. When the condition becomes numeric `1`, DCode updates its firing channel before constructing and recording the event payload, so `on_firing:` can run on that local path. The operator board updates later.

[Events](../DCode/Events.md) shows the declaration. Use `on_firing:` for condition-driven logic. `on_event:` follows event-board lifecycle instead: acknowledgement, resolution, and silencing are operator state, not a sensor condition.

Synchronous describes **call ordering**, not a fixed time limit. An inline handler that sleeps, performs slow I/O, or calls a blocking native function delays its writer. Keep inline work bounded and avoid cycles; DCode detects calculation re-entry and reports an error.

Task control channels follow that same write path. Committing `_running` or `_hold` synchronously records a lightweight lifecycle request; the task's start, hold/resume, and end handlers run later on the task's own thread (or its task-group thread). A slow lifecycle handler therefore stalls that task execution thread, not the channel writer.

## Scheduled logic

[CAESAR Tasks](Tasks.md) explains task creation, absolute release scheduling, task groups and failure diagnostics.

Fixed-channel reads and writes in a CAESAR task occur at their executing lines. A later task failure does not roll back an accepted write. [Fixed and dynamic channels](Channels.md#fixed-and-dynamic-channels) explains fixed storage and retained native bindings. [DARTWIC Builder](DARTWIC%20Builder.md) prepares the known layout before the task starts.

At 10 Hz, a periodic task has a nominal 100 ms period. A value arriving just after an iteration may wait until a later iteration to be observed. Execution time, operating-system scheduling, holds, and missed releases can add delay. Increasing the target frequency does not establish a guaranteed deadline.

Use task diagnostics such as actual frequency, execution time, missed cycles, callback failures, and independently sampled health to detect missed timing or failed execution. These observations do not identify the cause by themselves. DCode's `missed:` section can react to missed releases; it does not replay every missed sample. See [Periodic Tasks](../DCode/Writing%20Periodic%20Tasks.md).

The independently sampled task-health report adds `active_overdue` for a callback that remains active beyond its completion deadline. It is an actionable observation, not an implicit hardware interlock. See [health and response](Deterministic%20Automation.md#2-health-and-response).

## Current failure behavior

Task groups order members that are due. A callback exception is logged and counted in `_failed_cycles`; the member still reports a dispatched cycle to the group, and later due members can run. Stopped members are skipped. Neither case automatically inhibits downstream automation or output. Missed-release diagnostics also do not establish a fault response for the hardware.

Inspect a group's `member_last_outcomes` rather than assuming a preceding ordered member supplied a fresh successful result. The [composition contract](Deterministic%20Automation.md#3-deterministic-composition) describes the available outcomes and the application decision they require.

Fixed reads observe the live value when their DCode line executes. A stale fixed read handle returns a numeric fallback; a stale write handle is rejected. Declare the known fixed inputs and explicitly validate measurement age and validity before using them for control. An unchanged numeric value alone cannot distinguish a steady measurement from failed acquisition.

Authority-denied value writes leave the live value unchanged and do not publish a successful commit notification. This applies to ordinary and prepared fixed operations. An accepted write still does not establish that hardware applied the command.

Command ownership, a local channel commit, and a successful physical action are separate facts. Choose fault responses from the hardware's hazards and verify them with device feedback; a universal zero output is not a safe default for every device. The Modbus driver guide describes software and protocol behavior; verify the physical response on your own equipment.

## From a software write to hardware

An accepted channel write means RAPID accepted and committed the value. It does not establish when a relay, valve, motor, or external controller changed state. That requires the driver to deliver the command and, where available, report feedback.

For an end-to-end measurement, account for:

1. Device sampling and transport to the acquiring module.
2. Local write, calculations, and event reactions.
3. Command authority and driver dispatch or output polling.
4. Network and device actuation time.

Keep the decision near the acquiring and actuating node when remote latency matters. A local calculation over a remote channel reacts to the **arrival of the remote update**, not the original physical measurement time.

## Interpreting timing measurements

Native DCode and fixed records reduce work on the repeated execution path by reusing prepared bindings, fixed storage, and bounded recording and observation handoffs. Supported fixed numeric collections and typed prepared plugin calls can also reuse owned storage. Other language and host operations, plugin code, and inline calculations may allocate or block. Compiling to C++ does not certify a callback or its inline dependencies. The native benchmark records host C++ allocation/free counts between observations and scheduled-release-to-completion time through missed-release recovery. Generated modules and plugin DLLs need separate probes; zero host counts alone would not prove an allocation-free deployment.

A short desktop benchmark is evidence for that workload and run, not a worst-case deadline bound. Windows scheduling and competing machine load can delay a release even when its callback performs no allocation; missed releases alone do not identify whether the delay came from the OS, callback logic, or core contention. Include driver execution, recording, contention, and reconfiguration in qualification. A callback-duration number by itself omits scheduling lateness and can omit recovery work.

## Reliability diagnostics

| Symptom | Inspect |
| --- | --- |
| Task falls behind | Actual frequency, execution time, missed cycles, held state. |
| UI skips intermediate values | Subscription interval and telemetry publication diagnostics. |
| History lags live data | Recording queue and persistence diagnostics. |
| Remote data stops arriving | TEMPEST peer connection state, received snapshots, channel timestamp, stale timeout, and queue/drop counters. A steady numeric value can be valid. |
| Output value does not change | Control policy, active controller, and command error. |
| Output value changes but hardware does not | Driver status and independent device feedback. |

[Channels](Channels.md), [Commanding and Control](Commanding%20and%20Control.md), and [Telemetry and History](Telemetry%20and%20History.md) explain the corresponding fields.
