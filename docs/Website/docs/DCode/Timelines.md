---
summary: Schedule countdown buckets, hold mission time at checkpoints, and inspect progress.
created: 2026-10-25
updated: 2026-10-28T19:10
---

A timeline schedules actions before and after **T0**, the reference time for a procedure. Its **mission time** counts toward T0 and continues afterward: `T-10s` is ten seconds before it, and `T+30s` is thirty seconds after it.

Each **bucket** is a group of steps scheduled at a mission time. **All buckets share one execution thread.** During a bucket's normal steps (`execute:`), managed waits and supported operator prompts pause only that bucket while other due buckets can progress. Long computations and blocking functions occupy the shared thread and delay all buckets.

Use a [sequence](Tasks.md#sequence-tasks) for a single ordered procedure without a mission clock. Timelines use the **Lua** backend.

# Timeline Configuration

Declare the timeline with `task_timeline` and choose how its clock begins. The default tick rate is 10 Hz. Supply exactly one of these fields:

| Field | Purpose |
| --- | --- |
| `clock_start: T-10s` | Start from a relative mission time on each task start. |
| `clock_t0: <timestamp>` | Set T0 to an absolute ISO-8601 timestamp with a timezone. |

Signed times accept units such as `T-1m` and `T+30s`, or a clock form such as `T+00:00:00.500`. Use `T+0s` for T0.

## Buckets

An `at` section groups the actions that become eligible when mission time reaches its scheduled time. For example, `at T-1m (tank_fill):` names a bucket that starts one minute before T0. Labels are optional, but must be unique when supplied.

Put the bucket's steps in `execute:`. Add `hold_at:` beside it when later mission times must wait for the bucket to finish. The checkpoint can be a signed time at or after the bucket's start, or `next_bucket` when a following bucket exists.

## Lifecycle Handlers

Handlers let you add actions for holding, resuming, stopping, or aborting a procedure. Their location determines which work they belong to:

| Location | Purpose |
| --- | --- |
| Timeline-level `hold:`, `resume:`, `stop:`, `abort:` | Handle the whole timeline; these runtime sections are siblings of the `at` buckets. |
| Bucket-level `execute:`, `hold:`, `resume:`, `stop:`, `abort:` | Handle one bucket inside its `at` runtime section. Use `execute:` for ordinary steps when lifecycle handlers are present. |

`hold_at:` is a field, not a handler. A bucket's `once:` blocks remember that they have run throughout that bucket execution, including across waits and repeated handler calls. Resetting or replaying the bucket creates fresh memory. The [timeline reference](Reference/Runtime%20Blocks/runtime-task_timeline.md) lists all fields and handlers.

# Timeline Lifecycle

Activation registers the timeline; starting it begins the clock and bucket execution. Completing one bucket does not release the timeline's channel claims. The timeline stops when all buckets complete.

Stopping uses the [shared task cleanup](../Engine/Modules%20and%20Tasks.md#stop-and-cleanup): authority is released after active work and lifecycle handling, while channel values remain.

Hold a running timeline before reactivating its file. An interrupted run can leave in-progress buckets uncertain; inspect recovery state before resetting or replaying them. [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) covers replacement.

# Timeline Example

In a test project, create `docs_demo_fill_request`, `docs_demo_fill_complete`, and `docs_demo_timeline_step`, all at 0. These are demo channels with no hardware connection. Save and activate this file, then start **docs_demo_timeline**:

```dcode
task_timeline docs_demo_timeline:
    clock_start: T-10s

    at T-10s (tank_fill):
        hold_at: T+0s
        execute:
            command |docs_demo_fill_request| = 1
            wait_until(|docs_demo_fill_complete| == 1, 0)
            command |docs_demo_fill_request| = 0
            free |docs_demo_fill_request|

    at T-5s (status_update):
        execute:
            |docs_demo_timeline_step| = 1

    at T+0s (next_step):
        execute:
            |docs_demo_timeline_step| = 2
```

Leave `docs_demo_fill_complete` at 0 to see the buckets overlap:

| Mission time | Result |
| --- | --- |
| T-10s | `tank_fill` requests filling, then waits. Its execution is still active. |
| T-5s | `status_update` writes step 1 and completes, even while `tank_fill` is waiting. |
| T0 | If filling is unfinished, its `hold_at: T+0s` holds the clock before `next_step` starts. The fill bucket keeps checking for completion. |

Set `docs_demo_fill_complete` to 1: the fill bucket writes 0, releases its claim, and completes. Its scheduled clock hold releases, allowing `next_step` to write step 2. The timeline stops once every bucket completes.

Reset the demo inputs before another run. Stopping while the fill bucket waits can skip its later cleanup statements; release of authority alone leaves the stored value in place. Reset the demo request to 0 when finished.

# Bucket Execution

A bucket becomes **active** when its execution starts. It remains active until its steps finish, including time spent in a managed wait or prompt; the Interface can show it as running or waiting. It is **complete** only when its execution finishes successfully. Reaching the next bucket's time does not complete the previous bucket. Failed or interrupted buckets need separate recovery.

**Multiple buckets can be active at the same time.** They take turns on one timeline thread. A managed wait yields its bucket so other due buckets can start or continue; an ordinary blocking call can stall the whole timeline.

Use the timeline view and its mission-time, clock-running, execution-time, and missed-cycle channels to inspect progress. Each bucket reports its start/end mission times and elapsed duration.

# Clock and Task Holds

The mission clock and the task have separate hold controls. A clock hold lets active buckets keep working; a task hold pauses the thread, their execution, and managed waits. In the channel names below, `<name>` is the timeline task name.

| Control | Effect |
| --- | --- |
| `hold_at: T+0s` | If this bucket is unfinished at T0, hold mission time before admitting buckets at that checkpoint or later. Active buckets keep working. |
| `hold_at: next_bucket` | Use the next scheduled bucket's time as the checkpoint. |
| `<name>_clock_hold` | Operator control over mission time. Writing 0 also overrides an active scheduled hold. |
| `<name>_hold` | Holds the whole task and its managed waits. |

`hold_at` sets a readiness checkpoint; it does not pause the bucket that owns it. If the bucket finishes before the checkpoint, no scheduled hold is needed. In the example, T0 lets the T-5s status bucket run while filling continues. Using `next_bucket` instead would put the checkpoint at T-5s.

Completing a bucket releases its scheduled clock hold. ARGUS shows a Release action for the scheduled hold; releasing it can admit later buckets while the earlier bucket remains unfinished.

Holds retain channel authority. Operator manual override still takes precedence; [Timeline Lifecycle](#timeline-lifecycle) covers completed-stop cleanup.

Gantt bars follow mission time: a bucket can keep working while its bar stays at the held clock time.

# Bucket Waits and Prompts

Some calls that normally block their caller are **specially managed inside a bucket's `execute:`**. The call still waits for a result before the next statement runs, but it gives the timeline thread back while waiting:

| Call | Outside a timeline bucket | Inside `execute:` |
| --- | --- | --- |
| `wait`, `wait_until` | Waits on the invoking thread. | Suspends only the calling bucket; other due buckets can progress. |
| `promptYesNo`, `promptNumerical`, `promptString`, `promptOptions` | Waits for input on the invoking thread. | Keeps the prompt open and suspends only the calling bucket until answered. |
| `callDcodeCallback` | Waits for the callback result on the invoking execution path. | Yields the calling bucket while waiting for the managed callback result. |
| Blocking device/plugin calls or long computations | Occupies the invoking thread. | Still occupies the shared timeline thread and delays all buckets. |

For example, activate and start this demo, then leave the prompt unanswered:

```dcode
task_timeline docs_demo_prompt:
    clock_start: T-5s

    at T-5s (approval):
        execute:
            approved = promptYesNo("Demo approval", "Continue the demo?", [], "", 0)
            if approved == 1:
                |docs_demo_approved| = 1

    at T+0s (status_update):
        execute:
            log("Timeline demo", "T0 reached while approval may still be waiting")
```

At T0, the status bucket writes its log even if the prompt is still open. The approval bucket remains active and waiting; it continues after the answer arrives. Add `hold_at: next_bucket` beside its `execute:` if T0 must wait for that bucket to finish.

Give simultaneously active prompts distinct titles within their system/subsystem. Closing a prompt without answering fails its waiting bucket. Stop or reset closes pending bucket prompts before subsequent statements run.

This cooperative behavior applies to the supported calls above in bucket execution. Timeline and bucket lifecycle handlers run synchronously. `hold(...)` has no bucket wrapper and can stall the thread; use `hold_at:` for a timeline checkpoint. Quiet expiry or acknowledgement does not answer a prompt or release a hold.

# Good Practices

Use managed waits inside `execute:` when the bucket must wait for feedback. They pause that bucket's steps without blocking the timeline thread. For a signal that must stay ready for half a second, replace the example's wait with:

```dcode
wait_until(|docs_demo_fill_complete| == 1, time=0.5, timeout=30)
```

This waits for sustained feedback and fails the bucket if it does not arrive within 30 seconds. Failure does not mark the bucket complete or automatically release its scheduled clock hold.

- Wait for a feedback or readiness signal, rather than checking whether a command was sent.
- Use `hold_at` when later buckets depend on that result. A bucket wait alone does not prevent them from starting.
- Avoid busy `while` loops and blocking device/plugin calls in bucket code. Put long-running acquisition in a task or module and wait on its reported state.
- Keep `hold:`, `resume:`, `stop:`, and `abort:` handlers short; they run synchronously.

# Reference

- [Timeline task](Reference/Runtime%20Blocks/runtime-task_timeline.md) — Clock syntax, lifecycle sections, and generated channels.
- [Operator prompts](Reference/DCode%20Functions/function-promptYesNo.md) — Arguments and response values.
- [Wait for a condition](Reference/DCode%20Functions/function-wait_until.md) — Wait duration and timeout rules.
- [Callbacks](Callbacks.md) — Waiting and background callback execution.
