---
summary: Schedule countdown buckets, hold mission time at checkpoints, and inspect progress.
created: 2026-10-25
updated: 2026-10-26T14:16
---

A timeline schedules actions before and after **T0**, the reference time for a procedure. Each named **bucket** contains a set of steps that starts at its scheduled mission time. Use it when several parts of a countdown need to progress independently.

Timelines use the **Lua** backend. For one ordered procedure without a mission clock, use a [sequence](Tasks.md#sequence-tasks).

# Create a countdown

In a test project, create `docs_demo_fill_request`, `docs_demo_fill_complete`, and `docs_demo_timeline_step`, all at 0. These are demo channels with no hardware connection. Save and activate this file, then start **docs_demo_timeline**:

```dcode
task_timeline docs_demo_timeline:
    clock:
        start: T-10s

    at T-10s (tank_fill):
        hold_at: next_bucket
        execute:
            command |docs_demo_fill_request| = 1
            wait_until(|docs_demo_fill_complete| == 1, 0)
            command |docs_demo_fill_request| = 0
            free |docs_demo_fill_request|

    at T+0s (next_step):
        execute:
            |docs_demo_timeline_step| = 2
```

The fill bucket requests 1 and waits for completion. If it is still waiting at T0, `hold_at: next_bucket` stops the mission clock before the next bucket starts. Set `docs_demo_fill_complete` to 1: the fill bucket writes 0, releases its claim, and completes. Its scheduled clock hold releases, allowing the next step to run. The timeline stops once all buckets finish.

Reset the demo inputs before another run. Stopping while the fill bucket waits can skip its later cleanup statements; release of authority alone leaves the stored value in place. Reset the demo request to 0 when finished.

# Choose times and sections

Use `T-` before T0 and `T+` at or after it: `T-1m`, `T+30s`, and `T+00:00:00.500` are valid times. The header is `at T-1m (tank_fill):`. Labels are optional but must be unique when supplied.

The required `clock:` contains either `start:` for an initial mission time or `t0:` for an absolute ISO-8601 time with a timezone. Keep `hold_at:` beside `execute:` at bucket level. It can name a signed time at or after the bucket's start, or `next_bucket` when a following bucket exists.

Timeline-level and bucket-level `hold:`, `resume:`, `stop:`, and `abort:` sections provide lifecycle handling. A bucket using these sections puts its ordinary statements in `execute:`. The final reference lists the complete syntax and fields.

# Understand the two holds

| Control | Effect |
| --- | --- |
| Bucket `hold_at:` | Holds mission time and admission of later buckets at a checkpoint. Active buckets keep working. |
| `<name>_clock_hold` | Operator control over mission time. Writing 0 also overrides an active scheduled hold. |
| `<name>_hold` | Holds the whole task and its managed waits. |

Completing a bucket releases its scheduled clock hold. An operator's separate clock hold stays active. A failed or uncertain bucket needs operator release, reset, or stop. ARGUS shows a Release action for the scheduled hold; releasing it can admit later buckets while the earlier bucket remains unfinished.

Holds retain channel authority. Completed stop releases it; neither holding nor releasing authority sends a physical stop command. Operator manual override still takes precedence.

# Wait for an operator

Waits and prompts suspend only their calling bucket. The countdown and other due buckets continue unless a clock checkpoint holds them. For example, inside an `execute:` section:

```dcode
approved = promptYesNo("Demo approval", "Continue the demo?", [], "", 0, 0)
if approved == 1:
    |docs_demo_approved| = 1
```

Use `hold_at:` when later mission times must wait for that approval. Give simultaneously active prompts distinct titles within their system/subsystem. Closing a prompt without answering fails its waiting bucket. Stop or reset closes pending bucket prompts before subsequent statements run.

Waiting DCode callback calls also yield their bucket. Outside timeline buckets, these functions wait on their invoking execution thread. `hold(...)` has no cooperative bucket wrapper and can stall the tick; quiet expiry or acknowledgement does not answer a prompt or release a hold.

# Inspect timing and recovery

Use the timeline view and its mission-time, clock-running, execution-time, and missed-cycle channels to follow progress. Buckets expose mission-clock start/end times and elapsed duration. A clock hold can let work continue while its Gantt bar stays at the held mission time.

Buckets share one tick thread. Ordinary code, long computations, and synchronous host/plugin calls can stall every bucket. When a tick exceeds its period, the timeline excludes that tick's execution interval from mission-time advancement and shifts effective T0. It does not catch up by launching all buckets crossed only by that delay. CAESAR still measures the full duration and reports enabled timing warnings.

Hold a running timeline before hot reload. Reset or replay rearms scheduled gates; interrupted in-progress buckets can be marked uncertain on activation. Review their equipment state before continuing. See [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) for replacement failures and retained state.

# Reference

- [Timeline task](Reference/Runtime%20Blocks/runtime-task_timeline.md) — Clock syntax, lifecycle sections, and generated channels.
- [Operator prompts](Reference/DCode%20Functions/function-promptYesNo.md) — Arguments and response values.
- [Wait for a condition](Reference/DCode%20Functions/function-wait_until.md) — Wait duration and timeout rules.
- [Callbacks](Callbacks.md) — Waiting and background callback execution.
