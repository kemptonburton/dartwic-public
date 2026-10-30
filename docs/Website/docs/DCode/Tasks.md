---
summary: Choose periodic, state-machine, or sequence tasks and use their shared lifecycle.
created: 2026-10-26
updated: 2026-10-27T21:02
---

Declare automation with `task_periodic`, `task_state_machine`, or `task_sequence`. These work in Lua and Native C++. [Engine task structures](../Engine/Modules%20and%20Tasks.md#task-structures) explains when to choose each; the syntax and examples are below.

Use [Timelines](Timelines.md) for countdown buckets or [Loops](Loops.md) for lightweight work that starts on activation.

# Task Configuration

Set scheduling options after the task name. This header requests 10 Hz at normal priority with timing warnings disabled (body omitted):

```dcode
task_periodic tasks_noise_filter 10 normal disable_warnings:
```

| Header option | Meaning |
| --- | --- |
| Frequency, such as `10` | Positive Hz; defaults to 10. `10` requests ten iterations per second, with a nominal 100 ms interval. |
| Priority | `background`, `normal`, `high`, or `critical`; defaults to `normal`. Supply a frequency before a priority. |
| `disable_warnings` | Optional final flag suppressing automatic timing warnings. Diagnostics, missed-cycle counts, and callback errors remain available. Omit it to keep timing warnings enabled. |

Periodic and state-machine tasks share these options. Sequence headers accept them too, but frequency does not pace sequence steps or create frequency channels; use waits.

Frequency and priority are scheduling requests, not deadline guarantees. [Execution and Timing](../Engine/Execution%20and%20Timing.md) explains timing costs and scheduling.

# Task Lifecycle

DCode runtime sections supply the code for each phase of the [shared task lifecycle](../Engine/Modules%20and%20Tasks.md#lifecycle).

## Activation

Save and activate the `.dcode` file, then start the task in **Tasks**. Activation registers its definition; starting executes it. Closing the editor does not stop it.

![](_attachments/Pasted%20image%2020261026143627.png)

The image above shows a state machine task running. By clicking the task icon in the DCode editor gutter, you can go to the Tasks page and start the task.

## Start

DCode has no `configure:` section. Initialize working variables in `start:` or before their first read. They persist across the run's sections and iterations, then reset on the next start. File globals have a separate lifetime; see [Values and Scope](Values%20and%20Scope.md).

Starting does not grant channel authority. Value-free `command` or `set` in `start:` can acquire an available claim without changing the stored value.

For DCode, **prefer `command` on every commanded write and `set` on every published measurement or status value**, even after acquiring authority in `start:`. These operations show intent and can reacquire an available claim; ordinary assignments only use existing authority. See the [authority examples](../Engine/Channels%20and%20Control.md#dcode).

A rejected authority operation warns and leaves that channel unchanged; it does not automatically fail start or skip the task body.

## Hold and Resume

Resume continues the same run without repeating `start:` or resetting working variables. See the [shared runtime behavior](../Engine/Modules%20and%20Tasks.md#runtime) for holds and in-flight execution.

## Stop and Cleanup

Put intentional final commands in `end:`. Stopping a task during a managed wait skips the remaining statements in its current handler. Natural sequence completion also runs end handling. The [shared stop and cleanup rules](../Engine/Modules%20and%20Tasks.md#stop-and-cleanup) explain authority release and retained channel values.

Removing a declaration and reactivating removes the task. Reactivation rebuilds even unchanged definitions with fresh state and restarts previously running tasks; see [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md).

# Task Execution

Below are some examples of the three task types.

## Periodic Tasks

A periodic task reads live inputs each iteration. This filter retains its previous result. Create `demo_noise` at 0 in a test project, then activate and start:

```dcode
task_periodic tasks_noise_filter 10 normal:
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

Set `demo_noise` to 10; the filtered value approaches 10 over several iterations. `elapsed_seconds` excludes held time. Changing frequency changes the response because the coefficient applies once per iteration.

Use a [calculation](Channel%20Calculations.md) or [event condition](Events.md) for a reaction in the input-write path.

## State-machine Tasks

A state machine repeats its current state's handler until your script transitions elsewhere. Create free demo channels `demo_start_request`, `demo_done`, and `demo_active` at 0, then activate and start:

```dcode
task_state_machine docs_demo_process 10 normal:
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

### State Requests

| Channel | Meaning |
| --- | --- |
| `docs_demo_process_current_state` | Read-only current state. |
| `docs_demo_process_target_state` | Writable requested state. |

Both use numeric options from `states:`. A target-state write is a request; the task must accept it with `transition`, which updates both channels. For example, the active handler can accept an idle request:

```dcode
if target_state == states.idle:
    transition idle
```

Each handler receives `current_state` and `target_state` snapshots for that iteration.

Another task or timeline can request a state with:

```dcode
transition docs_demo_process to idle
```

The owning task still decides whether to accept the request.

![](_attachments/Pasted%20image%2020261026144254.png)

The target state channel has value options, so it can be commanded from the channel searcher, or even from schematics, or other DCode files by directly writing the state channel, without needing to use the `transition` keywords.

## Sequence Tasks

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

This example uses the shared [wait functions](Common%20Syntax%20and%20Functions.md#wait-and-wait_until), which are available wherever executable DCode is allowed.

# Task Controls and Diagnostics

Use the [shared task control and diagnostic channels](../Engine/Modules%20and%20Tasks.md#task-channels), with your task's name as the prefix, such as `tasks_noise_filter_running`. Change frequency through `_target_frequency` or Tasks, then compare `_actual_frequency` with the target.

For a sequence, `<name>_current_line` identifies its active source line and becomes zero after completion. [Startup behavior](../Engine/Modules%20and%20Tasks.md#configuration-and-registration) covers automatic Engine startup.

## Missed Releases

CAESAR can skip overdue releases. `missed:` receives `missed_count` and `lateness_ms` once for that group. Check the example's **Noise filter** stream and timing diagnostics. Keep this handler short; it cannot recover unacquired samples.

# Task Groups

A task group orders existing tasks or loops that are due together. With `read_sensors` and `control_outputs` already registered:

```dcode
task_group acquisition_cycle:
    run: read_sensors
    run: control_outputs
```

Members retain their frequency, diagnostics, and enabled state. A slow member delays later members; ordering does not establish successful acquisition or data freshness. See [task-group scheduling](../Engine/Execution%20and%20Timing.md#task-groups).

## Task Group Lifecycle

Activation installs the group's scheduling arrangement. Removing its declaration releases the grouping rather than removing its members. See [shared removal behavior](../Engine/Modules%20and%20Tasks.md#removal-and-replacement) for member state and authority.

# Reference

- [Task declarations](Reference/Runtime%20Blocks/Overview.md) — Periodic, state-machine, sequence, and group syntax.
- [Runtime sections](Reference/Runtime%20Sections/Overview.md) — Lifecycle bodies and their arguments.
- [State transitions](Reference/Statements/statement-transition.md) — Changing the current task state.
- [Cross-task transitions](Reference/Statements/statement-transition_task.md) — Requesting another task's state.
