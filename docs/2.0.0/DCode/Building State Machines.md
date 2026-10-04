---
updated: 2026-06-21T02:02
created: 2026-06-21
---

Use `task_state_machine` when task behavior is clearer as named states instead of one loop body.

# Basic Shape

```dcode
task_state_machine tasks/pump:
    states:
        idle
        filling
        complete

    state idle:
        if |tank/start.value|:
            transition filling

    state filling:
        if |tank/level.value| >= 90:
            transition complete

    state complete:
        |tank/pump_enabled.value| = false
```

# Task Channels

Activating `task_state_machine tasks/pump` creates a CAESAR task named `tasks/pump` with the `DCode` task type. State machines use the same task control channels as periodic tasks:

| Channel | Direction | Purpose |
| --- | --- | --- |
| `tasks/pump_running.value` | writable | Set to `1` to start the state-machine loop, or `0` to stop it. |
| `tasks/pump_target_frequency.value` | writable | Requested loop frequency in Hz. Defaults to `10`. |
| `tasks/pump_actual_frequency.value` | observe-only | Measured loop frequency in Hz. DCode writes `0` when the task is stopped. |
| `tasks/pump_hold.value` | writable | Set to `1` to hold the task without stopping it. Set back to `0` to release the hold. |

# State Channels

For `task_state_machine tasks/pump`, DCode manages:

- `tasks/pump_current_state.value`
- `tasks/pump_target_state.value`

Both channels have value options generated from the `states:` list. The current-state channel is observe-only and owned by the task. The target-state channel is writable so operators or scripts can request a state.

At each loop, DCode reads both state channels. If `target_state` selects a valid state and differs from `current_state`, DCode runs the target state's handler. `transition <state>` writes both the target and current state for the current task.

# Transitions

Use `transition <state>` to move the current state machine:

```dcode
transition filling
```

Use `transition <task> to <state>` to request a state on another task:

```dcode
transition tasks/pump to idle
```
