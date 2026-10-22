---
title: CAESAR Tasks
summary: Create tasks, understand their schedule, order task groups, and inspect failures.
updated: 2026-10-14T15:07
created: 2026-08-03T15:41
---

CAESAR runs DARTWIC's tasks. A task combines an implementation, configuration, start/stop lifecycle and diagnostics. A plugin task might read a device; a DCode task might calculate its next command. Both use the same task scheduler.

For the contract behind these diagnosticsâ€”periodic execution, health/response, and TaskGroup compositionâ€”read [Deterministic Automation](Deterministic%20Automation.md). It distinguishes the engine's observable behavior from device-specific safety decisions.

## Create and run a task

For a plugin, choose its registered task type in [Managing Tasks](../Interface/Managing%20Tasks.md), configure its module and arguments, then start it. For DCode, activating a script registers its tasks; starting a task runs its callbacks. Selecting Native C++ changes how supported DCode logic executes, while CAESAR continues to schedule it. For a repeated control path, configure fixed channels, bindings, and reusable task/driver buffers before start so the callback does not need to allocate or discover its work each release.

For example, this task requests **10 Hz: one release every 100 milliseconds**:

```dcode
task_periodic sample_control 10 normal:
    task:
        local measured = |device_measurement|
        local desired = measured * 2.0
        command |device_command| = desired
```

This illustrates scheduling and channel ownership, not a complete device controller. Configure the channels first. The [hardware-driver guide](../Plugins/Building%20a%20Hardware%20Driver.md) follows the Modbus implementation; the example below demonstrates task order without a device.

## How scheduling works

A standalone periodic task runs on its own thread. CAESAR uses a monotonic clock and advances the next planned release by the period. It does not add a fresh 100 ms sleep after completing each callback, which would accumulate execution time as scheduling drift.

The first release can run immediately after startup. A frequency is a target: a thread may wake late, and callbacks take time. CAESAR records those separately:

| Measurement | Meaning |
| --- | --- |
| Release lateness | How late execution starts relative to the planned release. |
| Callback duration | Time spent in the callback wrapper, including immediate channel operations and synchronous reactions for scheduled tasks. |
| Missed cycles | Planned releases skipped because execution has fallen behind. A slightly late wakeup does not necessarily skip a release. |
| Overruns | Callbacks whose measured duration reaches or exceeds their target period. |
| Actual frequency | Observed iteration rate; an average can conceal individual late releases. |

When overdue, CAESAR advances to a future release rather than replaying every skipped callback. DCode's `missed:` section, or a plugin's existing `on_missed` callback, receives the skipped count and lateness. Keep it short: it runs on the execution thread. Releases consumed by the missed handler are counted without recursively calling it again.

A missed handler can respond after a delay, but cannot run while its own thread is permanently blocked. A requested priority influences OS scheduling; it does not establish a deadline or interrupt a blocking callback. See [Execution and Timing](Execution%20and%20Timing.md) for measurement boundaries.

## Put related tasks in a task group

Use a group when existing tasks should execute in order:

```dcode
task_group device_cycle:
    run: device_read
    run: sample_control
    run: device_write
```

Configure all three at 10 Hz when every release should run acquisition, calculation and output in that order. The group runs due members sequentially on a coordinator thread, using one shared monotonic epoch. The members retain their names, lifecycle and diagnostics.

Members can have different frequencies. The group orders the members that are due together; it does not force slower members to run on every faster release. Its next wakeup comes from member schedules, and it uses the highest requested member priority. There is no additional group frequency or priority to configure.

A blocking member delays later members. Stopped members are skipped. If a callback throws, CAESAR records the failure and continues to later due members. `dartwic/get-task-groups` reports each member's most recent due-release outcome (`completed`, `callback_failed`, `skipped_stopped`, or `not_dispatched`). **Ordering does not mean that the previous step succeeded or supplied fresh data.** Use application logic to decide whether to send an output after an acquisition failure. The scheduler does not choose a device's fault response.

For declaration details and restrictions, use the [task-group reference](../DCode/Reference/Runtime%20Blocks/runtime-task_group.md).

## Try a read-control-write cycle

This complete demo copies a simulated measurement through three tasks. Save it as `docs_cycle.dcode`, activate it, and start all three tasks. Their group puts them in read, control, write order at 10 Hz.

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

Stop `docs_cycle_read` while the others run. The old measurement remains and the later tasks can still execute. That demonstrates why a real controller needs acquisition validity and freshness checks in addition to task order. Stop all three tasks when finished.

To try the prepared path, select Native C++ and activate the same file again. Its direct output declarations supply the fixed channels used by the other tasks. Check Builder and the editor's bindings, then repeat the observations. See [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md) for toolchain setup.

## Task structures and lifecycle

| Structure | Execution |
| --- | --- |
| Periodic | Repeats a callback at its requested frequency. |
| State machine | Schedules the current named state's behavior. |
| Sequence | Runs ordered work with managed progress. |
| Timeline | Runs the timeline implementation supplied by the task type. |
| Worker | Invokes long-running worker work; the worker manages its internal repetitions. |

A task's type identifies the implementation; its structure determines execution. Do not infer a DCode keyword from every native structure name. Plugin workers and ordinary DCode publish accepted writes when each write executes.

Holding preserves task state. Stopping ends the run and clears hold. Stop waits for executing work to return; it is not forced thread cancellation. A task's stop callback supplies its final behavior. Completed stop releases applicable task-owned user-channel authority, including observe-only outputs; task diagnostic channels retain their separate system protection.

Completed stop also releases that task's automatic overrides. It restores any surviving prior owner, preserves other active controllers and manual control, and does not change the accepted channel value. Stopped automation is not restored when manual control is later released.

A [module](Modules.md) owns a connection or shared service. One or more tasks can use it. Configure channels, bindings and reusable buffers before running, and use the existing reconfiguration lifecycle when mappings change.

## Controls and failure diagnostics

For a task named `sample_control`, both controls and diagnostics use `sample_control` plus their suffix:

| Suffix | Purpose |
| --- | --- |
| `_running` | Start/stop request. |
| `_hold` | Hold/release request on supported structures. |
| `_target_frequency` | Requested Hz on periodic, state-machine and timeline tasks. |
| `_actual_frequency` | Observed rate on those scheduled structures. Workers instead expose `_worker_rate`. |
| `_execution_time` | Smoothed callback duration in milliseconds on scheduled structures. |
| `_missed_cycles` | Cumulative skipped releases on scheduled structures. |
| `_failed_cycles` | Cumulative callback exceptions caught by CAESAR, on all task structures. |

Failure counts persist across stop/start of the same runtime task. A successful later cycle does not erase them. The failure channel is published by task synchronization outside the callback, so it is not an immediate exception handler. Code that catches its own error without rethrowing must report that error itself. Start/end lifecycle errors and process crashes are not counted as failed cycles.

Timing conditions are reported through ARGUS warnings. Execution-budget and missed-release percentages remain in runtime diagnostics without adding channels or a synthetic timing-status flag.

The [registered-tasks operation](Reference/TEMPEST/Operations/dartwic/get-registered-tasks.md) also returns an `execution` object with `failed_cycles`, `last_cycle_failed`, `callback_active` and `callback_active_ms`, plus an independently sampled `health` object when the task-health monitor has observed the task. The active duration includes time waiting inside the callback. A callback whose active duration reaches its completion deadline is reported as `active_overdue`; CAESAR never forcibly terminates it. A prepared fixed-channel release that finds a configuration writer is rejected promptly and reported as `configuration_contention`, rather than waiting behind that writer. Set `health_completion_deadline_ms` in task metadata or arguments to override the default one-period completion deadline. Unpaced workers and sequences have no assumed completion deadline; configure one explicitly when their work has a deadline. Application code may subscribe through CAESAR's task-health observer and choose the recovery action.

Task diagnostics tell an application **what happened**. They do not decide whether the next command is safe. For the prepared-path requirements and a practical response checklist, see [qualifying an automation deployment](Deterministic%20Automation.md#build-and-qualify-a-prepared-automation).

Use [Writing Periodic Tasks](../DCode/Writing%20Periodic%20Tasks.md) for `start:`, `task:`, `missed:` and `end:` examples. Use [Deterministic Automation](Deterministic%20Automation.md) to connect this scheduling model to prepared fixed storage, Native C++ DCode, bounded delivery, and health reporting.
