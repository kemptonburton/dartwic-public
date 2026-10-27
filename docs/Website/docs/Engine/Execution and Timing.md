---
summary: Understand inline reactions, scheduled releases, ordering, and completion.
created: 2026-09-06T14:34
updated: 2026-10-26T21:52
---

Execution timing describes when work starts, what it waits for, and when its result becomes available. A pressure reading, a controller's next decision, and a graph update can happen at different times.

**Inline** work runs within the call that triggered it. **Scheduled** work runs when its next iteration is due. **Asynchronous** work is handed to a background service. These distinctions help you put a response in the right place and measure the delay that matters.

# Execution paths

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

# Inline event reactions

A pressure sample committed locally can immediately evaluate a DCode event condition. When the condition becomes numeric `1`, DCode updates its firing channel before constructing and recording the event payload, so `on_firing:` can run on that local path. The operator board updates later.

[Events](../DCode/Events.md) shows the declaration. Use `on_firing:` for condition-driven logic. `on_event:` follows event-board lifecycle instead: acknowledgement, resolution, and silencing are operator state, not a sensor condition.

Synchronous describes **call ordering**, not a fixed time limit. An inline handler that sleeps, performs slow I/O, or calls a blocking native function delays its writer. Keep inline work bounded and avoid cycles; DCode detects calculation re-entry and reports an error.

Task control channels follow that same write path. Committing `_running` or `_hold` synchronously records a lightweight lifecycle request; the task's start, hold/resume, and end handlers run later on the task's own thread (or its task-group thread). A slow lifecycle handler therefore stalls that task execution thread, not the channel writer.

# Scheduled tasks

CAESAR is the Engine component that schedules tasks and manages their execution. A callback is the function it invokes for a task step. A periodic task requests a rate, such as 10 Hz, and CAESAR schedules its iterations. [Modules and Tasks](Modules%20and%20Tasks.md) explains setup and lifecycle.

Fixed-channel reads and writes in a CAESAR task occur at their executing lines. A later task failure does not roll back an accepted write. [Fixed and dynamic channels](Channels%20and%20Control.md#fixed-and-dynamic-channels) explains fixed storage and retained native bindings. [DARTWIC Builder](Advanced/DARTWIC%20Builder.md) prepares the known layout before the task starts.

At 10 Hz, the nominal period is 100 ms. A value arriving just after a task reads its input may wait for the next iteration. To interpret the delay, separate when the iteration was due from when it actually ran:

| Point in the cycle | Meaning |
| --- | --- |
| Planned release | The scheduled start of the iteration. |
| Actual start | The callback begins; scheduling lateness has already occurred. |
| Callback return | Its reads, writes, and synchronous reactions have finished. |
| Device feedback | The equipment reports its response, potentially later. |

Increasing target frequency changes the requested period; it does not establish a deadline for all four steps.

Use task diagnostics such as actual frequency, execution time, missed cycles, callback failures, and independently sampled health to detect missed timing or failed execution. These observations do not identify the cause by themselves. DCode's `missed:` section can react to missed releases; it does not replay every missed sample. See [Periodic Tasks](../DCode/Tasks.md).

The independently sampled task-health report adds `active_overdue` for a callback that remains active beyond its completion deadline. It is an actionable observation, not an implicit hardware interlock. See [Task health](Advanced/Deterministic%20Automation.md#task-health).

# Task scheduling

A **release** is the scheduled opportunity for one task iteration to start. A standalone periodic task runs on its own thread. CAESAR advances releases using a monotonic clock, which measures elapsed time independently of wall-clock corrections. It advances by the period rather than adding a fresh sleep after each callback, avoiding accumulated scheduling drift.

The first release can run immediately after startup. A frequency is a target: a thread may wake late, and callbacks take time. CAESAR records those separately:

| Measurement | Meaning |
| --- | --- |
| Release lateness | How late execution starts relative to the planned release. |
| Callback duration | Time spent in the callback wrapper, including immediate channel operations and synchronous reactions for scheduled tasks. |
| Missed cycles | Planned releases skipped because execution has fallen behind. A slightly late wakeup does not necessarily skip a release. |
| Overruns | Callbacks whose measured duration reaches or exceeds their target period. |
| Actual frequency | Observed iteration rate; an average can conceal individual late releases. |

When overdue, CAESAR advances to a future release rather than replaying every skipped callback. DCode's `missed:` section, or a plugin's existing `on_missed` callback, receives the skipped count and lateness. Keep it short: it runs on the execution thread. Releases consumed by the missed handler are counted without recursively calling it again.

A missed handler cannot run while its thread is blocked. Requested priority influences OS scheduling; it does not establish a deadline or interrupt a blocking callback.

# Task groups

A **task group** coordinates tasks that need an order, such as reading a device, calculating a command, then sending it. This declaration assumes `device_read`, `sample_control`, and `device_write` already exist. Members keep their identities and schedules:

```dcode
task_group device_cycle:
    run: device_read
    run: sample_control
    run: device_write
```

Configure all three at 10 Hz when every release should run acquisition, calculation and output in that order. The group runs due members sequentially on a coordinator thread, using one shared monotonic epoch. The members retain their names, lifecycle and diagnostics.

Members can have different frequencies. The group orders the members that are due together; it does not force slower members to run on every faster release. Its next wakeup comes from member schedules, and it uses the highest requested member priority. There is no additional group frequency or priority to configure.

A blocking member delays later members. Ordering does not require earlier members to succeed; see [failure behavior](#task-failures) before using the group to command equipment.

For declaration details and restrictions, use the [task-group reference](../DCode/Reference/Runtime%20Blocks/runtime-task_group.md).

## Read-control-write example

This complete demo needs no device: it creates its own simulated measurement and output channels. Save it as `scripts/docs_cycle.dcode` in a test project, activate it, and start all three tasks. Their group puts them in read, control, write order at 10 Hz.

```dcode
task_periodic docs_cycle_read 10:
    task elapsed_seconds:
        |docs_cycle_measurement| = elapsed_seconds

task_periodic docs_cycle_control 10:
    task:
        |docs_cycle_command| = |docs_cycle_measurement| * 2

task_periodic docs_cycle_write 10:
    task:
        |docs_cycle_feedback| = |docs_cycle_command|

task_group docs_cycle:
    run: docs_cycle_read
    run: docs_cycle_control
    run: docs_cycle_write
```

The feedback should follow twice the measurement. A live display can span adjacent updates, so compare recorded samples when investigating individual cycles. The last task only copies a value; it does not simulate a device's physical response.

Try one variation: stop `docs_cycle_read` while the other two tasks run. The measurement remains at its last value and later tasks can still execute. Task order alone therefore does not establish that acquisition succeeded or supplied fresh data. Stop all three tasks when finished.

To try the prepared path, select Native C++ and activate the same file again. Its direct output declarations supply the fixed channels used by the other tasks. Check Builder and the editor's bindings, then repeat the observations. See [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md) for toolchain setup.

# Task failures

Task groups order members that are due. A callback exception is logged and counted in `_failed_cycles`; the member still reports a dispatched cycle to the group, and later due members can run. Stopped members are skipped. Neither case automatically inhibits downstream automation or output. Missed-release diagnostics also do not establish a fault response for the hardware.

`dartwic/get-task-groups` reports `member_last_outcomes`: `completed`, `callback_failed`, `skipped_stopped`, or `not_dispatched`. Check them and input freshness before using an earlier member's result. [Task groups](Advanced/Deterministic%20Automation.md#task-groups) explains the application decision.

Fixed reads observe the live value when their DCode line executes. A stale fixed read handle returns a numeric fallback; a stale write handle is rejected. Declare the known fixed inputs and explicitly validate measurement age and validity before using them for control. An unchanged numeric value alone cannot distinguish a steady measurement from failed acquisition.

Authority-denied value writes leave the live value unchanged and do not publish a successful commit notification. This applies to ordinary and prepared fixed operations. An accepted write still does not establish that hardware applied the command.

Choose the output response for your equipment and verify it through feedback. A zero command is not suitable for every device. [Channels and Control](Channels%20and%20Control.md) explains write authority; the [driver guide](../Plugins/Building%20a%20Hardware%20Driver.md) covers delivery and readback.

# Hardware response

A channel commit is the software result: RAPID accepted the value. Physical response also includes driver dispatch, transport, and equipment motion. Measure through independent feedback when you need the full response time.

For an end-to-end measurement, account for:

1. Device sampling and transport to the acquiring module.
2. Local write, calculations, and event reactions.
3. Command authority and driver dispatch or output polling.
4. Network and device actuation time.

Keep the decision near the acquiring and actuating node when remote latency matters. A local calculation over a remote channel reacts to the **arrival of the remote update**, not the original physical measurement time.

# Timing measurements

A target rate and a short benchmark describe different things. Check release lateness, callback duration, failures, and feedback for the actual workload. [Deterministic Automation](Advanced/Deterministic%20Automation.md#timing-measurements) covers native allocation probes and deployment qualification.
