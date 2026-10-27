---
summary: Interpret runtime evidence and choose the next check when work fails or falls behind.
created: 2026-10-24
updated: 2026-10-26T20:11
---

Diagnostics are measurements of how the Engine is working: execution times, queue sizes, dropped data, memory use, and connection activity. They help explain a symptom, such as a slow task or missing history, without guessing from a display alone.

Open **Settings → Diagnostics** for Engine measurements, Tasks for application runtime health, and Network Map for peer connections. Start with the symptom and its time range:

| Symptom | Check first |
| --- | --- |
| Task falls behind | Running/held state, actual frequency, execution time, missed cycles, and health. |
| Task runs but gives the wrong result | Source/arguments, input freshness, callback failures, and command rejection. |
| Channel changes but equipment does not | Driver transaction result and independent feedback. |
| Graph skips intermediate values | Telemetry cadence and transport drops; compare recorded samples. |
| History lags or has gaps | Recording ingress, persistence progress, drops, retention, and query filters. |
| Remote data stops | Link state, received snapshots, source timestamps, and queue/drop evidence. |
| Operation times out | Session/connectivity and resulting Engine state before retrying. |

# Engine measurements

A **queue** holds work waiting for a background service. Its depth shows backlog; a **loss counter** records rejected work. Compare readings over the interval of the problem: an increasing loss count shows new losses, while a nonzero total may describe an earlier incident. Check the path involved—recording, notification, and network delivery have separate counters.

| Area | What the measurements establish |
| --- | --- |
| Resources | Machine/process CPU, physical memory, process resident memory, and storage on the actual data volumes. Process memory is not a heap-allocation count. |
| RAPID | Channel access/write rates, fixed-slot use, recording progress, queue pressure, and lost samples or notifications. Recording loss and notification loss have separate counters. |
| ARGUS | Event/log recording progress, backlog, write failures, and publication loss. Recording and Interface delivery have separate counters. |
| CAESAR | Scheduler and internal runtime measurements. Inspect an application's [task card](../Interface/Modules%20and%20Tasks.md) for its own timing and failures. |
| TEMPEST | Transport payload rates, bounded queues, drops, operation rejections, and timeouts. Mbps measures traffic; it does not establish available bandwidth or a successful physical command. |

For ARGUS recording, inspect `queued_jobs`, `deferred_updates`, `oldest_pending_ms`, and `rejected_recording_jobs_total`. For publication, inspect `publication_queued` and `publication_dropped_total`. An event can be visible before its history reaches disk, or recorded despite a missed display update.

Use [Network Map](../Interface/Network%20Map.md) for peer connection and snapshot progress. Replacing an obsolete display snapshot differs from losing recorded samples or rejecting an operation.

A slow Interface can reach a WebSocket byte limit even when the message-count queue is not full. Inspect `outbound_pending_bytes`, byte limits, and `dropped_total`. Transport drops do not establish lost recordings or a failed HTTP command. Send rates count accepted transport payloads; they do not confirm receipt or rendering. [Recording and Delivery Tuning](Advanced/Recording%20and%20Delivery%20Tuning.md#websocket-delivery) owns the transport capacity limits.

The independent engine sampler runs approximately every half second. Ordinary application snapshots arrive at 5 Hz. These are observation and delivery rates, not device sampling or control frequencies.

# Task health and failures

Task controls request behavior; diagnostics report observed work. For example, target frequency is the requested rate and actual frequency is the measured rate. A callback is the task function being executed. For a task named `sample_control`, channel names use these suffixes:

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

The [registered-tasks operation](Reference/TEMPEST/Operations/dartwic/get-registered-tasks.md) returns `execution` details and an independently sampled `health` report. Execution fields include `failed_cycles`, `last_cycle_failed`, `callback_active`, and `callback_active_ms`; active duration includes time waiting inside the callback.

For example, inspect one task with an already [connected Python client](../Clients/Python%20Client.md):

```python
response = client.operation("dartwic/get-registered-tasks", {
    "query": "sample_control", "scope": "tasks", "limit": 10,
})
response.raise_for_error()
for task in response.payload["tasks"]:
    print(task["name"], task.get("execution"), task.get("health"))
```

Replace `sample_control` with your task's name. Check its execution counters and health together; a callback can remain active even though the control channel already accepted a stop request.

| Health evidence | Meaning |
| --- | --- |
| `active_overdue` | A callback is still active after its completion deadline. CAESAR does not forcibly terminate it. |
| `configuration_contention` | A prepared fixed-channel release was rejected promptly because configuration was writing, rather than waiting behind it. |
| `health_completion_deadline_ms` | An explicit deadline in task metadata or arguments; otherwise scheduled tasks use one period. |

Unpaced workers and sequences need an explicit completion deadline when their work has one. Application code can observe task health and choose its recovery action.

# Warnings and timestamps

A warning reports a measured condition. For example, queue pressure asks you to investigate backlog; a rising loss counter establishes that work was rejected. Acknowledging either warning records that it was seen. Recovery depends on the condition improving, not on acknowledgement.

Local clock checks estimate Engine-minus-Interface offset using round-trip timing and uncertainty bounds. A positive offset means the Engine clock is ahead. They cannot determine which clock is correct or assume equal network delay in both directions. Repeated bound-confirmed violations are needed for warnings; delayed or ambiguous replies are insufficient.

Use [Navbar, Sidebar, and Settings](../Interface/Navbar%2C%20Sidebar%2C%20and%20Settings.md#diagnostics-and-warnings) for warning controls. Use [Execution and Timing](Execution%20and%20Timing.md) for scheduling boundaries and [Deterministic Automation](Advanced/Deterministic%20Automation.md) for qualification. Diagnostic evidence helps choose a response; the application or device supplies its fault behavior.
