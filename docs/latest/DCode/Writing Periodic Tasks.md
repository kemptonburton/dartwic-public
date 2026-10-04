---
updated: 2026-06-23T04:05
created: 2026-06-21
---

Use `task_periodic` for loop behavior that should run as a CAESAR task.

# Task Shape

```dcode
task_periodic tasks/noise_filter:
    start:
        state.last = 0

    task elapsed_seconds:
        local raw = |demo/noise.value|
        state.last = state.last + ((raw - state.last) * 0.2)
        |demo/noise_filtered.value| = state.last

    end:
        print("noise_filter stopped")
```

# Dynamic Pipe Paths

Use `{expression}` inside a pipe path when the channel name comes from a variable or loop. DCode evaluates each expression at runtime, converts it to text, and builds the final RAPID channel path before the read or write happens.

```dcode
task_periodic tasks/state_copy:
    task elapsed_seconds:
        for name in {"alpha", "beta", "gamma"}:
            local command = |demo/{name}_command.value|
            |demo/{name}_state.value| = command
            |demo/{name}_last_seen.value| = elapsed_seconds
```

If `name` is `alpha`, `|demo/{name}_state.value|` resolves to `demo/alpha_state.value`.

# Task Channels

Activating `task_periodic tasks/noise_filter` creates a CAESAR task named `tasks/noise_filter` with the `DCode` task type. CAESAR creates these RAPID channels for the task:

| Channel | Direction | Purpose |
| --- | --- | --- |
| `tasks/noise_filter_running.value` | writable | Set to `1` to start the loop, or `0` to stop it. |
| `tasks/noise_filter_target_frequency.value` | writable | Requested loop frequency in Hz. Defaults to `10`. |
| `tasks/noise_filter_actual_frequency.value` | observe-only | Measured loop frequency in Hz. DCode writes `0` when the task is stopped. |
| `tasks/noise_filter_hold.value` | writable | Set to `1` to hold the task without stopping it. Set back to `0` to release the hold. |

The task loop calls `start:` once when the task starts, calls `task elapsed_seconds:` repeatedly while `_running` is `1`, and calls `end:` when the task stops. `elapsed_seconds` is the task's elapsed runtime; time spent held is not counted as active runtime.

# Runtime State

Use the built-in `state` table for values that should survive between loop calls:

```dcode
task_periodic tasks/counter:
    start:
        state.count = 0

    task elapsed_seconds:
        state.count = state.count + 1
        |demo/count.value| = state.count
```

# Operator Feedback

Periodic tasks can publish ARGUS events when conditions matter to an operator:

```dcode
task_periodic tasks/pressure_guard:
    task elapsed_seconds:
        if |tank/pressure.value| > |tank/pressure_limit.value|:
            warning(
                "Tank pressure high",
                "Pressure exceeded the configured limit.",
                {"tank/pressure.value", "tank/pressure_limit.value"},
                "Reduce inlet flow."
            )
```
