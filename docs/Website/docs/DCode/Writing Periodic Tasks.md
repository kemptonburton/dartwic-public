---
summary: Run scheduled logic with persistent state and missed-release diagnostics.
updated: 2026-10-14T20:57
created: 2026-09-04T17:13
---

Use `task_periodic` for work that repeats at a requested frequency. It samples its inputs when its iteration runs; it does not run once per input update.

## A stateful filter

Create a demo channel named `demo_noise` with value `0`, then save and activate this file:

```dcode
task_periodic tasks_noise_filter:
    start:
        last = |demo_noise|

    task elapsed_seconds:
        raw = |demo_noise|
        last = last + (raw - last) * 0.2
        |demo_noise_filtered| = last

    missed:
        log("Noise filter", "Skipped " + tostring(missed_count) + " releases; lateness " + tostring(lateness_ms) + " ms")

    end:
        log("Noise filter", "Stopped")
```

`start:` runs at task start. `task elapsed_seconds:` repeats while running and not held. The elapsed value excludes held time. `end:` runs on stop. The filter's coefficient is applied once per iteration, so changing task frequency changes its time response.

Start the task, then change `demo_noise` to `10`. The filtered value should approach 10 over several iterations. If releases are skipped, open the **Noise filter** stream in Logs to see the count and lateness. Stop the task when finished.

## Operate the task

| Channel suffix | Purpose |
| --- | --- |
| `_running` | Write `1` to start or `0` to stop. |
| `_hold` | Write `1` to hold, `0` to resume. |
| `_target_frequency` | Requested Hz; defaults to 10. |
| `_actual_frequency` | Measured Hz; observe-only. |

For this example, the start channel is `tasks_noise_filter_running`. [Task Lifecycle](Sequences%20and%20Task%20Lifecycle.md) explains ownership and stopping.

## Missed releases

CAESAR can skip overdue releases. `missed:` runs once for the skipped group with `missed_count` and `lateness_ms`. Keep this handler short; it cannot recover physical samples that were never acquired. Inspect execution time and missed-cycle diagnostics when the requested frequency is not being achieved.

A 10 Hz loop has a nominal 100 ms interval. It is not an immediate limit detector. Use a [dependency-driven event](Events.md) when the condition should be evaluated in the input-update path.

## Dynamic channel names

This syntax works in both backends. [Native C++](Native%20C%2B%2B%20Execution.md) resolves interpolated names through the host at runtime, so these accesses are outside the prepared fixed-binding path.

`{expression}` inside a pipe reference builds a name at runtime:

```dcode
task_periodic tasks_state_copy:
    task elapsed_seconds:
        for name in ["alpha", "beta", "gamma"]:
            |demo_{name}_state| = |demo_{name}_command|
```

With `name` equal to `alpha`, the target is `demo_alpha_state`. Dynamic names work in calculations too, but require explicit trigger dependencies there. See [Channel Calculations](Channel%20Calculations.md).
