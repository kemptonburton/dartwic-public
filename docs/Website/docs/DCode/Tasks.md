---
summary: Choose periodic, state-machine, or sequence tasks and use their shared lifecycle.
created: 2026-10-26
updated: 2026-10-26T14:42
---

Tasks give an operator a named piece of automation to start, hold, inspect, and stop. Choose the task body that matches the work; the shared controls and lifecycle are described once below.

| Task kind | Use it for |
| --- | --- |
| Periodic | Sampling or control logic that repeats at a requested frequency. |
| State machine | Named stages with transitions accepted by your script. |
| Sequence | Ordered steps that run once per start, including waits. |

These three kinds work in Lua and Native C++. Use [Scheduling Timelines](Scheduling%20Timelines.md) for countdown buckets or [Loops](Loops.md) for lightweight work that starts on activation.

# Run and control tasks

Save and activate the `.dcode` file, then start the task in **Tasks**. Activation registers its definition; starting executes it. Closing the editor does not stop it.

![](_attachments/Pasted%20image%2020261026143627.png)

The image above shows a state machine task running. By clicking the task icon in the DCode editor gutter, you can go to the Tasks page and start the task.

Tasks create common channels for diagnostic and control purposes:

| Channel suffix | Purpose |
| --- | --- |
| `_running` | Write 1 to start or 0 to stop. |
| `_hold` | Write 1 to hold and 0 to resume. |
| `_failed_cycles` | Counted callback failures. |
| `_target_frequency`, `_actual_frequency` | Requested and measured Hz for periodic/state-machine tasks. |
| `_execution_time`, `_missed_cycles` | Timing diagnostics for periodic/state-machine tasks. |
| `_current_line` | Current sequence source line; zero after completion. |

For example, `tasks_noise_filter_running` controls the filter below. A sequence runs once per start; frequency does not pace its statements. Use waits for procedure timing.

# Periodic tasks

A periodic task reads its inputs when each scheduled iteration runs. This filter remembers its previous result between iterations. Create `demo_noise` at 0 in a test project, then activate and start the task:

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

Change `demo_noise` to 10. The filtered value should approach 10 over several iterations. `start:` initializes the run, `task elapsed_seconds:` repeats while running and not held, and `end:` runs on stop. Elapsed time excludes held time. Changing frequency changes this filter's response because its coefficient is applied once per iteration.

## Missed releases

CAESAR can skip overdue releases. The example's `missed:` handler receives `missed_count` and `lateness_ms` once for the skipped group. Check the **Noise filter** log stream and timing diagnostics when the requested frequency is not being achieved. Keep the handler short; it cannot recover samples never acquired.

A 10 Hz task has a nominal 100 ms interval. Use a [calculation](Channel%20Calculations.md) or [event condition](Events.md) for a reaction in the input-write path.

# State-machine tasks

A state machine repeats only its current state's handler. Your script decides when to move to another state. Create free demo channels `demo_start_request`, `demo_done`, and `demo_active` at 0, then activate and start this task:

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

Write `demo_start_request = 1` to enter active, then `demo_done = 1` to return to idle. Each state body repeats while current; put one-time state-entry work in a `once:` block. Sensor checks wait for the next scheduled iteration.

## Accept state requests

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

From another task or timeline runtime body, request this task's state with:

```dcode
transition docs_demo_process to idle
```

This changes its requested target state. The owning task must accept it and call `transition`; the request alone does not select a handler.

![](_attachments/Pasted%20image%2020261026144254.png)

The target state channel has value options, so it can be commanded from the channel searcher, or even from schematics, or other DCode files by directly writing the state channel, without needing to use the `transition` keywords.

# Sequence tasks

A sequence runs its body once on each start. Create `docs_demo_continue` at 0, then activate and start **docs_demo_steps**:

```dcode
task_sequence docs_demo_steps:
    |docs_demo_step| = 1
    wait(1)
    |docs_demo_step| = 2
    wait_until(|docs_demo_continue| == 1, timeout=30)
    |docs_demo_step| = 3
```

The step channel changes to 1, then 2 after the wait. Set `docs_demo_continue` to 1 before the timeout to reach step 3. Follow `docs_demo_steps_current_line` to see the active source line.

## Use waits deliberately

`wait(1)` pauses the sequence for one second. `wait_until` waits for its live condition; a positive `timeout` raises an execution error when it expires. Its optional `time` argument requires the condition to remain true continuously; false resets that interval. A zero timeout disables expiry.

Both waits work in Lua and Native C++. They block the sequence callback and belong outside fixed-rate control loops. A task hold pauses their duration and timeout accounting. Stop cancels a wait before later statements run; earlier accepted writes remain. Execution resumes according to scheduler and operating system timing.

# State and cleanup

Working variables persist across lifecycle sections and iterations within one task run. Initialize them in `start:` or before their first read. Each start recreates task state; file globals have their own shared lifetime. Use [Values and Scope](Values%20and%20Scope.md) for those ownership rules.

Hold preserves task state and pauses execution without resetting outputs. Completed stop releases automatic channel ownership, but the last stored value is separate from a physical stop command. Put required final actions in `end:` or the driver's shutdown behavior. Operator manual override remains in effect.

Reactivation rebuilds the file's runtime definitions with fresh state, including unchanged declarations. Surviving tasks that were running restart. See [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) before editing an active procedure.

# Order related tasks

A task group declares the order of existing tasks or loops that are due together. For example, if `read_sensors` and `control_outputs` are already registered:

```dcode
task_group acquisition_cycle:
    run: read_sensors
    run: control_outputs
```

Each member retains its frequency, diagnostics, and enabled state. A slow member delays following members; ordering alone does not establish that acquisition succeeded or data is fresh. [Execution and Timing](../Engine/Execution%20and%20Timing.md#task-groups) owns the scheduling explanation.

# Dynamic channel names

This syntax works in both backends. [Native C++](Native%20C%2B%2B%20Execution.md) resolves interpolated names through the host at runtime, so these accesses are outside the prepared fixed-binding path.

`{expression}` inside a pipe reference builds a name at runtime:

```dcode
task_periodic tasks_state_copy:
    task elapsed_seconds:
        for name in ["alpha", "beta", "gamma"]:
            |demo_{name}_state| = |demo_{name}_command|
```

With `name` equal to `alpha`, the target is `demo_alpha_state`. Dynamic names work in calculations too, but require explicit trigger dependencies there. See [Channel Calculations](Channel%20Calculations.md).

# Reference

- [Task declarations](Reference/Runtime%20Blocks/Overview.md) — Periodic, state-machine, sequence, and group syntax.
- [Runtime sections](Reference/Runtime%20Sections/Overview.md) — Lifecycle bodies and their arguments.
- [State transitions](Reference/Statements/statement-transition.md) — Changing the current task state.
- [Cross-task transitions](Reference/Statements/statement-transition_task.md) — Requesting another task's state.
- [Wait](Reference/DCode%20Functions/function-wait.md) — Duration and cancellation.
- [Wait for a condition](Reference/DCode%20Functions/function-wait_until.md) — Continuous-truth time and timeout.
