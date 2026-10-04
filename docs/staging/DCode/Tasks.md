---
updated: 2026-06-21T02:10
created: 2026-06-21
---

DCode task blocks create CAESAR tasks that run DCode through the `DCode` task type.

# Task Blocks

DCode currently has two task blocks:

| Block | Use It For |
| --- | --- |
| `task_periodic <portal>/<name>:` | Repeated loop logic that runs at a target frequency. |
| `task_state_machine <portal>/<name>:` | Sequenced logic with named states and transitions. |

Both task blocks create a task key from the block path. For example, `task_periodic tasks/monitor:` creates the task `tasks/monitor`.

# Shared Task Channels

Periodic and state-machine task blocks both create these RAPID channels next to the task:

| Channel | Direction | Purpose |
| --- | --- | --- |
| `<portal>/<name>_running.value` | writable | Set to `1` to start the task loop, or `0` to stop it. |
| `<portal>/<name>_target_frequency.value` | writable | Requested loop frequency in Hz. Defaults to `10`. |
| `<portal>/<name>_actual_frequency.value` | observe-only | Measured loop frequency in Hz. DCode writes `0` when the task is stopped. |
| `<portal>/<name>_hold.value` | writable | Set to `1` to hold the task without stopping it. Set back to `0` to release the hold. |

For `task_periodic tasks/monitor:`, those channels are:

- `tasks/monitor_running.value`
- `tasks/monitor_target_frequency.value`
- `tasks/monitor_actual_frequency.value`
- `tasks/monitor_hold.value`

# Periodic Tasks

Use `task_periodic` when the same logic should run repeatedly:

```dcode
task_periodic tasks/monitor:
    start:
        state.high_count = 0

    task elapsed_seconds:
        if |tank/level.value| > |tank/high_level.value|:
            state.high_count = state.high_count + 1

    end:
        print("monitor stopped")
```

`start:` runs once when the task starts. `task elapsed_seconds:` runs repeatedly while `_running` is `1`. `end:` runs when the task stops.

# State-Machine Tasks

Use `task_state_machine` when behavior is clearer as named states:

```dcode
task_state_machine tasks/fill:
    states:
        idle
        filling
        complete

    state idle:
        if |tank/start.value|:
            transition filling

    state filling:
        if |tank/level.value| >= |tank/target.value|:
            transition complete

    state complete:
        transition idle
```

State-machine tasks use the shared `_running`, `_target_frequency`, `_actual_frequency`, and `_hold` task channels.

State-machine tasks also create:

| Channel | Direction | Purpose |
| --- | --- | --- |
| `<portal>/<name>_current_state.value` | observe-only | Current state selected from the `states:` list. Owned by the task. |
| `<portal>/<name>_target_state.value` | writable | Requested state selected from the `states:` list. |

For `task_state_machine tasks/fill:`, those channels are:

- `tasks/fill_current_state.value`
- `tasks/fill_target_state.value`

Use `transition <state>` inside the current state machine to update both state channels for the current task. Use `transition <task> to <state>` to request a state on another state-machine task.

# Task State

Use the built-in `state` table for task values that should survive across loop calls or state executions:

```dcode
task_periodic tasks/counter:
    start:
        state.count = 0

    task elapsed_seconds:
        state.count = state.count + 1
        |demo/count.value| = state.count
```

Use `local` for temporary values inside a single block or function. Use bare assignments only when the name should live on the script module.
