---
summary: Understand inline reactions, scheduled releases, ordering, and completion.
created: 2026-09-06T14:34
updated: 2026-10-28T20:17
---
When writing device drivers, automation, and commanding actual hardware, it is important to keep in mind when things happen. Just because a channel is written does not mean that the hardware will move instantly.

Execution timing describes when work starts, what it waits for, and when its result becomes available. A pressure reading, a controller's next decision, and a graph update can happen at different times.

**Synchronous** (inline) work finishes before the triggering call returns. **Scheduled** work runs when its next iteration is due. **Asynchronous** work continues independently through a background service. These distinctions help you put a response in the right place and measure the delay that matters.

# Execution Paths

Below are examples for synchronous and asynchronous work that occurs in DARTWIC. Follow the operation that caused the work. A channel write can complete its calculations before history or display updates arrive.

| Work                                                         | What starts it                                                              | When it happens                                                                      |
| ------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Calculate a channel’s incoming value                         | Something writes to that channel                                            | **Synchronously**, before the new value is saved.                                    |
| Recalculate a value when an input changes                    | An input channel receives a new value                                       | **Synchronously**, after the input changes and before the original write finishes.   |
| Check a DCode event’s `trigger:` condition                   | The script activates or an input changes                                    | **Synchronously**, without waiting for a periodic check.                             |
| Run an event’s `on_firing:` logic                            | The event begins firing or a relevant input changes                         | **Synchronously**, as part of the event calculation.                                 |
| Run a periodic task or state machine                         | Its next scheduled iteration is due                                         | **Asynchronously**, on its CAESAR execution thread at the requested rate.            |
| Read sensor data or send a command to equipment              | A driver samples a device or processes a command                            | **Synchronously or asynchronously**, depending on the driver and device protocol.    |
| Update the Interface—sensor readings, channel tables, graphs | The Engine publishes telemetry for the Interface                            | **Asynchronously**; the display can update after the Engine has processed the value. |
| Save measurements to history                                 | A write or periodic snapshot produces a sample under the recording settings | **Asynchronously**, after the sample enters the recording queue.                     |
| Send data to another Engine or peer                          | The local node publishes an update                                          | **Asynchronously**, across the connection to the other node.                         |
# Synchronous Execution

Synchronous calculations and reactions execute as part of the caller's work, including when a scheduled task writes a channel.

## Inline Event Reactions

A pressure sample committed locally can immediately evaluate a DCode event condition. When the condition becomes numeric `1`, DCode updates its firing channel before constructing and recording the event payload, so `on_firing:` can run on that local path. The operator board updates later.

[Events](../DCode/Events.md) shows the declaration. Use `on_firing:` for condition-driven logic. `on_event:` follows event-board lifecycle instead: acknowledgement, resolution, and silencing are operator state, not a sensor condition.

DCode events were designed to behave this way so that important actions can be taken immediately by automation.

For example, suppose a temperature sensor exceeds its limit. The event’s `on_firing:` section runs synchronously when the new reading is published, immediately overriding the valve command to close. A device write task running at **100 Hz** picks up that command on its next iteration—nominally within **10 ms**. The command is sent to the device and the valve is closed sometime later.

A polling loop monitoring the temperature sensor running at 100 Hz** could wait up to **10 ms** before detecting the same condition, followed by up to **10 ms** for the write task. That gives a nominal software scheduling delay of **20 ms versus 10 ms—a 2× reduction**.

This example assumes negligible processing time and tasks meeting their schedules. Driver communication and the valve’s physical movement add further delay.

## Task Control Requests

Task control channels follow that same write path. Committing `_running` or `_hold` synchronously records a lightweight lifecycle request; the task's start, hold/resume, and end handlers run later on the task's own thread (or its task-group thread). A slow lifecycle handler therefore stalls that task execution thread, not the channel writer.

# Asynchronous Execution

Asynchronous work continues separately after the action that started it. The caller hands work to a queue, worker, or connection and can continue before that work finishes. This keeps storage and display delivery from holding up a controller's channel write.

For example, after a sensor publishes a pressure reading, the Engine can use that value locally while other services handle:

- **History recording:** admitted samples wait for storage workers to write them to disk.
- **Interface updates:** telemetry carries observations to channel tables, graphs, and other displays.
- **Peer delivery:** updates travel to another Engine or application and are processed there.
- **Background operations:** some requests return a job ID so the client can check progress and collect the result later.

# Scheduled Tasks

CAESAR schedules periodic tasks and state machines at a requested frequency. At **10 Hz**, a task is due every **100 ms**. An input arriving just after the task reads it may wait for the next iteration. The requested rate is a target; actual timing depends on scheduling and how long the task takes.

A standalone task runs on its own thread. Tasks in a group share a coordinator. [Modules and Tasks](Modules%20and%20Tasks.md#caesar) covers their configuration and lifecycle.

## Task Scheduling

A **release** is the scheduled start of an iteration. CAESAR advances releases using a monotonic clock. If execution falls behind, it skips missed releases rather than replaying every iteration.

Some timing measurements are RAPID diagnostic channels; others are fields in the [task health report](Diagnostics%20and%20Troubleshooting.md#task-health-reports). Channel suffixes below follow the task name: for `sample_control`, `_execution_time` means `sample_control_execution_time`.

| Measurement | Channel or report field | Meaning |
| --- | --- | --- |
| Release lateness | `health.release_lateness_last_ms` — report field | How late execution started, in milliseconds. No dedicated task channel. |
| Callback duration | `_execution_time` — diagnostic channel | Smoothed execution time in milliseconds, including channel writes and synchronous reactions. The health report also exposes `health.callback_duration_last_ms`. |
| Missed cycles | `_missed_cycles` — diagnostic channel | Total skipped iterations. A slightly late start does not necessarily skip one. |
| Overrun status | `health.state` = `overrun` — report field | A completed callback reached or exceeded its completion deadline, normally one task period. No dedicated overrun channel. |
| Actual frequency | `_actual_frequency` — diagnostic channel | Observed iterations per second. An average can hide individual late iterations. |

DCode's `missed:` section can respond to skipped iterations. Keep it short: it runs on the task's execution thread and cannot run while that thread is blocked. `health.state` can also report `active_overdue` when a callback is still executing past its deadline.

## Task Groups

A **task group** runs due members in declaration order on one thread. For example, if `device_read`, `sample_control`, and `device_write` already exist, this group puts acquisition before control and output:

```dcode
task_group device_cycle:
    run: device_read
    run: sample_control
    run: device_write
```

At a shared frequency, the three tasks run in that order each cycle. Their combined work must fit the period; a slow member delays the next. Members keep their own schedules, so a slower member runs only when due. See [Task Groups](Modules%20and%20Tasks.md#task-groups) for setup and examples.

# Realtime and Deterministic Tasks

Sometimes tasks need to meet a specific deadline every time or things will fail. A controller needs a cycle that fits its equipment's timing requirements. A 500 Hz controller has a nominal 2 ms period; a slower 50 Hz controller has 20 ms. Either can require strict deadlines. **Real-time** means meeting the required deadline, rather than merely averaging the requested frequency.

Lua suits everyday automation when its small timing variation is acceptable. For tighter cycles, Native C++ DCode and fixed channels move compilation, storage allocation, and binding into preparation:

```text
Scheduled native task → Prepared channel reads → Calculate → Write
                                                        → Background recording and delivery
```

DARTWIC provides a deliberate path toward predictable, real-time control: **[fixed channels](Channels%20and%20Control.md#fixed-and-dynamic-channels), [native C++ DCode](../DCode/Native%20C%2B%2B%20Execution.md) running through [supported CAESAR artifacts](Modules%20and%20Tasks.md#caesar), and a prepared real-time deployment.**

There are two different boundaries: **the prepared real-time path limits routine framework allocations; the broader hot path prohibits global framework locks.** Being outside the allocation guarantee does not permit a global lock in a hot operation.

Linux/PREEMPT_RT is the reference target because the owner wants a Linux-capable computer retaining the full engine: native C++ modules, plugins, networking and background recording can coexist with the prepared execution path.

**Covered does not mean a whole task is allocation-free or has a proven deadline.** Follow each synchronous call into calculations, plugins and device work. The prepared framework mechanisms have scoped Windows evidence; actual Linux-machine scheduling, activation and deadline qualification remain deferred.

## Locking and Allocation

A **lock** can make a caller wait for shared state. Existing-channel access and task execution exclude global framework locks, but local protection remains around individual channels, calculations, and runtimes. Calls sharing a calculation can still wait for one another. The Linux real-time mutex backend supports priority inheritance to help lock holders finish for higher-priority waiters.

**Allocation** obtains memory while code runs and can add variable work. For the most deterministic control path, use Task Types that configure fixed RAPID channels in `on_configure`, and C++ DCode scripts that use RAPID fixed channel in your automation scripts. Those paths reuse framework storage without routine heap allocation/free.

Calculations, callbacks, sequences, lifecycle work, event/log calls, and plugin bodies can still allocate. A native write that triggers a Lua calculation includes that calculation's execution and lock wait in its cycle.

Recording and notifications use separate bounded buffers. Full admission rejects and counts incoming records instead of waiting for disk or a dashboard; see [recording](Recording%20and%20Telemetry.md#recording-capacity) and [delivery diagnostics](Diagnostics%20and%20Troubleshooting.md#rapid). Preparation, first use, and configuration have separate costs.

# Hardware Response

When writing automation that drives hardware, it is important to keep in mind when things happen. Just because a channel is written does not mean that the hardware will move instantly. A channel commit is the software result: RAPID accepted the value. Physical response also includes driver dispatch through the CAESAR task, wire transport, and equipment motion. Measure through independent feedback when you need the full response time, such as using a potentiometer to measure the actual angle of your actuator after you commanded it to move.

For an end-to-end measurement, account for:

1. CAESAR task sampling the Device and publication into a RAPID channel.
2. Local write, calculations, and event reactions.
3. CAESAR task reading the RAPID channel and dispatching a command back to the Device.
4. Network and device actuation time.
