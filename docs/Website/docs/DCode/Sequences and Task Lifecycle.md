---
summary: Run ordered steps and control task start, hold, stop, and persistent state.
updated: 2026-10-22T17:46
created: 2026-10-04T18:31
---

Use a sequence for ordered work with a visible source-line position. Use [periodic tasks](Writing%20Periodic%20Tasks.md) for repeated sampling and [state machines](Building%20State%20Machines.md) for named operating phases.

## Run a sequence

Save and activate this script, then start `docs_demo_steps` in the task resource:

```dcode
task_sequence docs_demo_steps:
    |docs_demo_step| = 1
    wait(1)
    |docs_demo_step| = 2
    wait_until(|docs_demo_continue| == 1, timeout=30)
    |docs_demo_step| = 3
```

Set `|docs_demo_continue|` to `1` before the 30-second timeout to let the example reach step 3. The sequence reports its current DCode source line through `docs_demo_steps_current_line`. `wait(seconds)` pauses for a finite nonnegative number of seconds. `wait_until(condition, time=0, timeout=0)` checks the live condition; `time` requires continuous truth and resets on false, while zero succeeds on the first true observation. A positive `timeout` raises an execution error; zero disables expiry. Both work in Lua and Native C++. A sequence hold pauses duration and timeout accounting. Stop cancels the wait before later statements run, while accepted writes remain. These blocking steps are not hardware timing guarantees; the scheduler and operating system determine when execution resumes. The former statement forms and public `sleep` are no longer accepted.

## Shared task controls

A task named `docs_demo_steps` creates the following channels:

| Suffix | Purpose |
| --- | --- |
| `_running` | Write `1` to start or `0` to stop. |
| `_hold` | Write `1` to hold execution; write `0` to release the hold. |
| `_current_line` | Current sequence source line; zero after completion. |
| `_failed_cycles` | Counted callback failures. |

Periodic and state-machine tasks share the running and hold controls and additionally expose `_target_frequency`, `_actual_frequency`, `_execution_time`, and `_missed_cycles`; their default target frequency is 10 Hz. Sequences run their body once per start and do not create these frequency diagnostics. A sequence header accepts the common optional frequency/priority settings, but frequency does not pace individual statements; use waits for procedure timing.

A hold pauses execution without being an output reset. Stopping releases the task's automatic channel ownership, but the last stored output value is not itself a physical stop command. Put final actions in an `end:` section or driver shutdown path as appropriate to your application.

Timelines follow the same authority boundary: hold keeps their channel control, while completed stop releases it. If a timeline is restored in a stopped state, activation also clears any saved timeline control over output channels. An operator's manual override remains active.

## Schedule a timeline

Declare the task as `task_timeline <name> [frequency_hz] [priority] [disable_warnings]:`. The frequency is a positive number in Hz and defaults to 10. Priority is `background`, `normal` (default), `high`, or `critical`; supply a frequency before a priority. The optional trailing `disable_warnings` suppresses timing warnings but keeps measurements and callback errors. Timeline DCode runs through the Lua backend.

Buckets advance independently. `wait(...)`, `wait_until(...)`, operator prompts, and waiting DCode callback calls suspend only the bucket that called them. The countdown keeps advancing, and later buckets can start before that earlier bucket finishes. For example, an unanswered prompt at T-30s does not prevent a bucket at T-10s from starting. Use `hold_at:` when a prerequisite must prevent mission time from crossing a later checkpoint.

A bucket's ordinary Lua code and synchronous host/plugin calls still share the timeline tick thread. A blocking call or long computation can therefore stall every bucket and freeze the published countdown. If a tick takes longer than its configured period, the timeline excludes that tick's execution interval when it next advances mission time and shifts effective T0 by that interval. It does not catch up across the blocked time or immediately launch buckets crossed only by that delay. CAESAR still measures the full callback duration and reports enabled deadline/missed-release warnings. This recovery rule does not make arbitrary blocking calls safe or cancellable. Lifecycle handlers outside bucket execution still run synchronously.

The bucket header is `at T-1m (tank_fill):`, **not** `at: T-1m`. The time is relative to T0. Use `T-` before T0 and `T+` at or after T0; `T+0s` is T0. A time accepts a number followed by `ms`, `s`, `m`, or `h` (`T-1m`, `T+30s`, `T+1.5m`), or `HH:MM:SS` with optional fractional seconds (`T-00:01:00`, `T+00:00:00.500`). Bare `1m` and `T0` are not accepted. The optional parenthesized label must be unique within the timeline.

```dcode
task_timeline docs_demo_timeline:
    clock:
        start: T-1m

    at T-1m (tank_fill):
        hold_at: next_bucket
        execute:
            command |fill_task_running| = 1
            wait_until(|fill_complete| == 1, 0)
            free |fill_task_running|

    at T+0s (ignition):
        execute:
            command |ignition_task_running| = 1
```

| Directly under `task_timeline` | Accepted form and placement |
| --- | --- |
| `clock:` | Required once. Inside it, use exactly one of `start: T-1m` (initial mission time) or `t0: 2026-10-14T18:00:00Z` (an ISO-8601 timestamp with `Z` or an explicit UTC offset). |
| `at <time> [(label)]:` | Required at least once. Each header starts a bucket at the specified signed T time; the label is optional. Buckets run in scheduled time order. |
| `hold:`, `resume:`, `stop:`, `abort:` | Optional timeline-level handlers, at most one of each. They run for the corresponding task lifecycle action. |

| Directly under each `at T...:` bucket | Accepted form and placement |
| --- | --- |
| `hold_at: <time>` | Optional, at most once. The signed T time must be at or after this bucket's start. If the bucket is unfinished then, hold the mission clock before admitting later buckets. |
| `hold_at: next_bucket` | Alternative to a time. Use the next bucket's scheduled time after ordering the buckets. The last bucket cannot use this form. |
| `execute:` | The bucket's runnable statements. You may put statements directly in the bucket when there are no bucket lifecycle sections. If any of the sections below is present, `execute:` is required and all ordinary statements go inside it. |
| `hold:`, `resume:`, `stop:`, `abort:` | Optional bucket-level handlers, at most one of each. They run for the corresponding task lifecycle action on a started bucket. Place them at the same indentation as `execute:`. |

`hold_at:` is a field alongside `execute:`, not a statement inside it. A scheduled hold pauses **mission time** and admission of later buckets; the active bucket continues executing and evaluating waits. Timeline tasks also expose `<name>_clock_hold`: writing `1` holds the mission clock manually, while writing `0` resumes it and explicitly overrides an active scheduled hold. `<name>_clock_running` reports whether mission time is advancing. The separate `<name>_hold` pauses the whole task and its managed waits.

Completing the bucket releases its scheduled clock hold, while an operator's separate clock hold stays active. A failed or uncertain bucket requires operator release, reset, or stop. The scheduled hold appears in ARGUS with a Release action; releasing it allows later buckets to start even when the earlier bucket remains unfinished. Reset or replay rearms its gate. When every bucket completes, the timeline stops and releases its channel authority. See the generated [timeline reference](Reference/Runtime%20Blocks/runtime-task_timeline.md) for the declaration and generated channels.

Each bucket publishes `<name>_bucket_<bucket>_started_at` and `_ended_at` on the mission clock, plus `_duration` as elapsed execution time. The timeline Gantt uses the mission-time endpoints for its bar and labels elapsed duration separately. While the clock is held, active bucket work may continue without extending its bar past the held T-time.

## Keep state between calls

Task variables remember their values between iterations within one run. Each task start recreates its working state; initialize variables in `start:` before reading them:

```dcode
task_periodic docs_demo_count:
    start:
        count = 0

    task elapsed_seconds:
        count = count + 1
        |docs_demo_count_value| = count
```

Bare assignments in a runtime block persist across its lifecycle sections. `local` is optional; a runtime block or function uses `global name` to access file-prelude data. File globals share one store across the runtime blocks of the same file and reset on activation. A compound update to a global is not atomic across concurrent tasks; use RAPID channels for coordinated control state. See [Values and Scope](Values%20and%20Scope.md).

Running the file again rebuilds its tasks and loops with fresh runtime state, even when a declaration has not changed. Surviving tasks that were running are restarted. See [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) for the full replacement lifecycle, YAML templates, and channels that can remain afterward.

## Lightweight loops

A named `loop` starts when its script is activated:

```dcode
loop docs_demo_copy 2:
    |docs_demo_copy_value| = |docs_demo_count_value|
```

This requests two iterations per second. Use a full task when an operator needs the task resource's lifecycle controls and status. Loops are still scheduled work, not inline dependency reactions; use a [channel calculation](Channel%20Calculations.md) for immediate derivation.

See [Managing Tasks](../Interface/Managing%20Tasks.md) for operation and [Engine Tasks](../Engine/Tasks.md) for scheduler structures, missed releases, and native tasks.
