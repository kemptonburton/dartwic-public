---
summary: Run named states and make state requests explicit.
updated: 2026-10-22T17:46
created: 2026-08-03T15:41
---

Use `task_state_machine` when behavior is easier to understand as named stages. A CAESAR task loop executes the current state's handler at the target frequency.

The header accepts `task_state_machine <name> [frequency_hz] [priority] [disable_warnings]:`, just like a periodic task. Frequency defaults to 10 Hz and must be positive. Priority defaults to `normal`; supply a frequency before `background`, `normal`, `high`, or `critical`.

## A two-state example

This example uses demo channels, not hardware. An operator writes `demo_start_request = 1` to begin, then `demo_done = 1` to return to idle.

```dcode
task_state_machine docs_demo_process:
    states:
        idle
        active

    state idle:
        |demo_active| = 0
        if |demo_start_request| == 1:
            |demo_start_request| = 0
            transition active

    state active:
        |demo_active| = 1
        if |demo_done| == 1:
            |demo_done| = 0
            transition idle
```

Activate the script and start its task. Each state body repeats while that state is current. Put one-time state-entry work in a `once:` block if it must not repeat. DCode treats numeric zero as false in both backends. Explicit comparisons such as `== 1` make channel conditions easy to read.

## Current state and requested state

| Channel | Meaning |
| --- | --- |
| `docs_demo_process_current_state` | Read-only current state. |
| `docs_demo_process_target_state` | Writable requested state. |

Both expose numeric value options generated from the `states:` list. A target-state write alone does **not** select another handler. Your script must accept the request and call `transition`, which updates both state channels for the current task.

For example, this check in the active handler accepts an operator request for idle:

```dcode
if target_state == states.idle:
    transition idle
```

The handler receives snapshots of `current_state` and `target_state`. Define the permitted transitions in script logic so the UI's target selector represents a request with explicit acceptance rules.

## Request another task's state

From inside another CAESAR task or timeline runtime body:

```dcode
transition docs_demo_process to idle
```

This requests the other task's target state; that task must implement the acceptance logic described above.

## Timing and task controls

State machines share running, hold, target-frequency, and actual-frequency controls with periodic tasks. Hold preserves state. Stopping ends the run; closing its view does not stop it.

Sensor conditions checked in a state handler wait for that handler's next scheduled iteration. Use an [event condition](Events.md) for an inline response to a dependency update. See [Execution and Timing](../Engine/Execution%20and%20Timing.md) before using either path for hardware control.
