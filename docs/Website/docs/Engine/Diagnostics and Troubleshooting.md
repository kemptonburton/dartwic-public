---
summary: Interpret runtime evidence and choose the next check when work fails or falls behind.
created: 2026-10-24
updated: 2026-10-28T22:03
---

Diagnostics help explain a slow task, missing recordings, or a display that stops updating. Use the measurements to identify which part of the system needs investigation, then check its events and logs.

# Diagnostics

Open **Settings → Diagnostics**. The tabs separate measurements from the connected Engine and checks made by your local Interface:

| Tab | Measured by | What it helps you check |
| --- | --- | --- |
| Resources | Engine | CPU, memory, and available storage. |
| RAPID | Engine | Channel activity, fixed-channel capacity, recording, and update delivery. |
| ARGUS | Engine | Event/log recording, backlog, and write failures. |
| CAESAR | Engine | Task and loop frequency, execution time, missed iterations, and failures. |
| TEMPEST | Engine | Network traffic, delivery queues, rejected work, and peer snapshots. |
| LOCAL INTERFACE | Interface | Interface/Engine clock differences and local settings issues. |

![](_attachments/Pasted%20image%2020261028190944.png)


## Diagnostic Rows and Warnings

Engine and interface diagnostics are shown in the Diagnostics table, each as their own row with a measurement.

Search for a measurement or expand its row for details. A dash or blank graph means unavailable or stale, not zero. **Show supporting measurements** reveals Engine inputs normally hidden from the table.

Each row has a configurable warning setting. Engine diagnostics raise ARGUS warnings that can be viewed in the Node Board or through Events. Local Interface checks raise Interface settings issues. 

Administrators can use a row's settings button to enable diagnostics and, for numeric measurements, choose **ABOVE**, **BELOW**, or **OUTSIDE RANGE** limits. Counter and runtime rows use their own warning controls; local Interface controls apply to that Interface.

![](_attachments/Pasted%20image%2020261028202343.png)

All rows turn yellow with a warning icon when a warning is active. Warnings tied to ARGUS events can be selected to open them up in the Node Board, as it is a normal ARGUS event. 

![](_attachments/Pasted%20image%2020261028203903.png)

Interface-only warnings are kept in the Interface's settings-issue list. They do not create Engine ARGUS events or RAPID channels. They are usually shown in the Notifications tab in the Interface Navbar with a warning icon. Clock warnings provide a button to open Diagnostics; other settings issues that send a notification provide a button to open Settings.

When the Engine measures something such as its CPU usage, it publishes that reading to a RAPID channel. For example, `engine_dartwic_cpu_usage_percent` can be viewed in Channels, graphed, or read by a client. The Engine updates these diagnostic channels; applications cannot overwrite their values.

If a diagnostic raises an ARGUS warning, the event links its associated channels when available so you can inspect the measurements behind it, and there is also a button in the Event info panel to view trigger source and open the warning in settings.

![](_attachments/Pasted%20image%2020261028203926.png)

 Some diagnostic details have no channel of their own, so a warning can also carry evidence only in its description and details. Supporting inputs, such as the values used to calculate a percentage, are published as channels only when needed by an enabled measurement.

Unless saved settings or task configuration change them, the defaults are:

| Measurement or warning | Default behavior |
| --- | --- |
| Core Engine measurements | Enabled; their channels update when readings are available. |
| TEMPEST traffic-rate warnings | Rates are measured, but threshold warnings need a limit you choose. |
| Application task and loop warnings | Normally enabled; a task type or `disable_warnings` can turn them off. |
| Internal Engine/plugin loop warnings | Off; enable them for the runtime when its timing policy permits. |
| Interface clock warnings | On, with settings saved in that Interface. |
| Supporting measurements | Hidden initially. **Show supporting measurements** reveals them; needed channel inputs publish with their parent measurement. |

Switching off an Engine measurement stops its diagnostic channel updates and alerts; the underlying service keeps working and collecting its internal counters. Inputs shared with another enabled measurement remain available. 

## Engine

An internal diagnostic loop runs roughly every half second, sampling resource use and collecting counters from Engine services. This can reveal a recorder falling behind even while current channel values still update. The open settings page refreshes roughly once per second.

### Resources

These measurements show whether the computer has enough CPU, memory, and storage for its workload. They help distinguish Engine load from pressure caused by other applications.

| Measurement              | Meaning                                                                       | What a warning could mean                                                                                |
| ------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| System / Engine CPU (e.g. `engine_dartwic_cpu_usage_percent`) | Machine load and the Engine process's share of processing capacity.           | Too much work; high system load with lower Engine load can point to other programs.                      |
| System / Engine memory (e.g. `engine_system_memory_usage_percent`) | Machine RAM usage and Engine resident memory, relative to total physical RAM. | Less room for recording buffers, caches, and other applications. Resident memory is not heap allocation. |
| Free storage (`engine_storage_available_mb`) | Free space on volumes holding RAPID and ARGUS data.                           | Recording may fail unless space is freed or storage/retention is adjusted.                               |

Memory and storage sizes display in decimal MB.

### RAPID

RAPID holds current channel values and queues recording and notification work for background services. This tab helps explain why live values look healthy while history or downstream updates fall behind.

| Measurement | Meaning | What a warning could mean |
| --- | --- | --- |
| Channel activity (e.g. `engine_rapid_dynamic_writes_per_sec`) | Channel activity per second, available as supporting measurements. | Workload context; there is no universal safe throughput limit. |
| Fixed slots (`engine_rapid_fixed_capacity_used_percent`) | Occupied fixed-channel slots versus capacity. | New fixed channels may run out of slots. |
| Recording backlog (`engine_rapid_recording_queue_used_percent`) | Samples waiting for storage versus samples committed. | Input exceeds storage throughput, or a writer is stalled. |
| Recording loss/errors (e.g. `engine_rapid_recording_dropped_rows_total`) | Rejected samples or unsuccessful recording work. | History may have gaps; inspect storage and writer errors. |
| Notification delivery (e.g. `engine_rapid_publication_queue_used_percent`) | Observations waiting for or failing downstream delivery. | A consumer cannot keep up or its callback failed; accepted writes are not undone. |

`engine_rapid_publication_overwritten_total` counts rejected notifications despite its legacy name.

A **queue** is a waiting list. A short backlog that drains may be normal; one that keeps growing indicates a slower consumer. Larger buffers absorb bursts but cannot fix a service that stays too slow. See [recording capacity](Recording%20and%20Telemetry.md#recording-capacity).

### ARGUS

ARGUS records events and logs. Recording and viewer delivery are separate: an event can appear before it reaches disk, or be recorded even if the viewer misses an update.

| Measurement | Meaning | What a warning could mean |
| --- | --- | --- |
| Log backlog (`engine_argus_log_queue_used_percent`) | Records waiting for the writer. | Logging exceeds the writer's current throughput. |
| Recording loss/errors (e.g. `engine_argus_log_write_errors_total`) | Rejected records or failed persistence work. | Some evidence may not have been saved; inspect storage and the last writer error. |
| Recording stalls (e.g. `engine_argus_event_no_progress_seconds`) | Pending work without new recording commits; zero when idle. | A writer is blocked or failing, rather than simply having no new events to record. |

Details such as `queued_jobs`, `oldest_pending_ms`, and `publication_dropped_total` distinguish recording backlog from viewer delivery loss.

### CAESAR

The **CAESAR** tab includes task and loop diagnostics. These measurements show whether your code runs as often as requested and finishes each iteration in time. The row names below illustrate a task named `sample_control`; use your runtime's name.

| Measurement | Meaning | What a warning could mean |
| --- | --- | --- |
| Requested/observed rate (e.g. `sample_control_actual_frequency`) | Requested rate versus observed iterations per second; workers report work rate. | Execution or blocking waits prevent the requested rate. |
| Callback duration (`sample_control_execution_time`) | Smoothed callback duration, including waits and synchronous reactions. | The callback consumes too much of its scheduled period or deadline. |
| Skipped iterations (`sample_control_missed_cycles`) | Scheduled iterations skipped after execution fell behind. | A task, shared loop, or CPU workload takes too long. |
| Callback failures (`sample_control_failed_cycles`) | Callback exceptions caught by CAESAR. | Inspect task events, logs, and inputs for failing code. |

Warning behavior depends on timing policy and deadlines. Unpaced workers and sequences need an explicit deadline when applicable. [Task health](#task-health-and-failures) also identifies callbacks still active past their deadline.

A task configured with `disable_warnings` is omitted from the Settings CAESAR rows. Its task-owned counters and task-health report remain available. For DCode, add the flag to the header; this excerpt omits the body:

```dcode
task_periodic sample_control 100 normal disable_warnings:
```

### TEMPEST

TEMPEST moves commands and observations between nodes and applications. These measurements distinguish quiet connections from congested delivery or missing peer data.

| Measurement | Meaning | What a warning could mean |
| --- | --- | --- |
| Traffic rate (e.g. `engine_tempest_tx_mbps`) | TEMPEST payload traffic, excluding some transport overhead. | Compare with your configured limit; this is not spare network bandwidth. |
| Adapter utilization (e.g. `engine_network_tx_used_percent`) | Estimated use of local adapters carrying TEMPEST traffic. | Other applications can contribute to congestion; loopback or unavailable data may have no estimate. |
| Delivery backlog/loss (e.g. `engine_tempest_queue_used_percent`) | Waiting transport work or observations rejected by full buffers. | A receiver or link cannot keep up; WebSocket byte and message limits both matter. |
| Request failures (e.g. `engine_tempest_operation_timeouts_total`) | Refused requests or requests not answered before their deadline. | Check connection/session state and resulting state before retrying; timeout leaves completion unknown. |
| Peer snapshot health (e.g. `engine_tempest_expected_snapshot_age_seconds`) | Freshness and acceptance of configured peer streams. | A connected peer may not be delivering usable snapshots. |

Mbps warning limits have no default ceiling. Expanded transport details include `outbound_pending_bytes` and `dropped_total`.

Dropped display updates do not prove recordings were lost. Diagnostics, acquisition, recording, and 5 Hz channel-display delivery have separate timing and failure paths.

## Interface

**LOCAL INTERFACE** checks this Interface's connection to the Engine. It currently measures the clock relationship and lists local settings issues; it does not measure general browser CPU or rendering performance.

### Clock Comparison

When the Interface clock differs from the Engine clock, data look early or late. The Interface checks its clock against the Engine in the background while connected, even with Settings closed.

| Shown value | Meaning |
| --- | --- |
| Interface / engine clock offset | Engine time minus Interface time, in seconds; positive means Engine ahead. |
| Uncertainty | The estimated range around the offset, allowing unequal network delays. |
| Round trip | Time for the check to reach the Engine and return, including processing. |
| Last check and status | When a valid measurement arrived, or why one is unavailable. |

Expand the row for details. Its settings button controls warnings and the offset limit, defaulting to one second. Three confirmed violations warn; two confirmed healthy checks clear it. Slow or ambiguous exchanges cannot establish that a clock is wrong, and the check cannot identify which clock is correct.

Local preferences belong to this Interface. Settings issues below the measurement link back to the relevant settings; they are separate from Engine ARGUS events.

# Other Diagnostics

Task cards, Network Map, and events/logs provide more specific evidence outside Settings → Diagnostics.

## Task Health and Failures

Open [Modules and Tasks](../Interface/Modules%20and%20Tasks.md) to inspect a task's controls, state, and timing on its card.

A task configured for 100 Hz may run more slowly or get stuck. Its channels and health report show actual execution. For `sample_control`, suffixes below form names such as `sample_control_actual_frequency`:

| Suffix | Meaning |
| --- | --- |
| `_running` | Start/stop request; an active callback may still be finishing. |
| `_hold` | Hold/release request on supported task structures. |
| `_target_frequency` | Requested Hz for scheduled tasks. |
| `_actual_frequency` | Observed rate for scheduled tasks; workers use `_worker_rate`. |
| `_execution_time` | Smoothed callback duration in milliseconds for scheduled tasks. |
| `_missed_cycles` | Total skipped scheduled iterations. |
| `_failed_cycles` | Total callback exceptions caught by CAESAR. |

### Failure Counters

A task can fail during one iteration without stopping entirely. `_failed_cycles` counts callback exceptions and survives stop/start of that task. It updates after execution. Errors your code catches, start/end failures, and process crashes need separate reporting.

### Task Health Reports

A health report helps investigate a stuck or late task. With a [connected Python client](../Clients/Python%20Client.md), use [get-registered-tasks](Reference/TEMPEST/Operations/dartwic/get-registered-tasks.md):

```python
response = client.operation("dartwic/get-registered-tasks", {
    "query": "sample_control", "scope": "tasks", "limit": 10,
})
response.raise_for_error()
for task in response.payload["tasks"]:
    print(task["name"], task.get("execution"), task.get("health"))
```

Replace `sample_control` with your task. Execution fields include `failed_cycles`, `last_cycle_failed`, `callback_active`, and `callback_active_ms` (including waits).

| Health evidence | Meaning |
| --- | --- |
| `active_overdue` | Callback still running past its deadline; not forcibly terminated. |
| `configuration_contention` | Prepared release rejected during a configuration write. |
| `health_completion_deadline_ms` | Configured task deadline; scheduled tasks otherwise use one period. |

Unpaced workers and sequences need an explicit deadline when applicable. Your application chooses recovery actions.

## Peer Connections

A remote value can remain visible after its source stops updating. In [Network Map](../Interface/Network%20Map.md), check connection state, received snapshots, and advancing source timestamps. [Remote channel freshness](Networking%20and%20Peers.md#remote-channel-freshness) explains what these establish.

## Warnings and Timestamps

Engine warnings appear as ARGUS events; local Interface issues appear in Settings. Use [Events and Logs](Events%20and%20Logs.md) to investigate at the source time. Acknowledgement does not repair the condition. [Execution and Timing](Execution%20and%20Timing.md) covers scheduling and [locking and allocation](Execution%20and%20Timing.md#locking-and-allocation) limits.
