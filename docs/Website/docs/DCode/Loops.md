---
summary: Run lightweight repeated work on activation and inspect its state and timing.
created: 2026-10-26
updated: 2026-10-27T03:06
---

A loop is lightweight work that repeats at a requested frequency and starts when its file is activated. Use it for simple background automation. Use a [task](Tasks.md) when an operator needs explicit start, hold, and stop controls.

# Loop Configuration

Set the requested frequency after the loop name. This header requests 10 Hz with timing warnings disabled (body omitted):

```dcode
loop docs_demo_poll 10 disable_warnings:
```

| Header option | Meaning |
| --- | --- |
| Frequency, such as `10` | Required positive Hz. `10` requests ten iterations per second, with a nominal 100 ms interval. |
| `disable_warnings` | Optional final flag suppressing timing warnings. Measurements, missed-cycle counts, and callback errors remain available. Omit it to keep timing warnings enabled. |

# Loop Lifecycle

Activating the file starts the loop. Closing the editor does not stop it. Reactivation replaces the loop; removing its declaration and reactivating removes it. See [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) for replacement, failures, and backend limits.

Completed removal or replacement waits for active work and applicable cleanup, then releases **all channel authority held by the loop**. It does not delete channels or reset their stored values. Other controllers' claims and operator control follow the [channel cleanup rules](../Engine/Channels%20and%20Control.md#stop).

# Loop Execution

Prefer `command` for commanded writes and `set` for published measurements or status. These operations show intent and can acquire an available channel claim; ordinary assignments use existing authority. See the [authority examples](../Engine/Channels%20and%20Control.md#dcode).

## Loop Example

Create `docs_demo_count_value` at 0 in a test project, then activate this file:

```dcode
loop docs_demo_copy 2:
    set |docs_demo_copy_value| = |docs_demo_count_value|
```

The loop requests two iterations per second. Change the input and inspect `docs_demo_copy_value`; it follows on a later iteration. This is scheduled work. A [channel calculation](Channel%20Calculations.md) instead runs in response to accepted input writes.

## Working Variables

A loop has no `start:` section. Initialize working variables on its first iteration with `once:`:

```dcode
loop docs_demo_loop_count 2:
    once:
        count = 0
    count = count + 1
    set |docs_demo_loop_count_value| = count
```

Variables remain available between iterations until reactivation. Running the file again rebuilds the loop and resets its working state. File globals have a different owner; see [Values and Scope](Values%20and%20Scope.md).

# Loop Timing and Diagnostics

Frequency is a scheduling request. Inspect the generated channels to compare it with actual execution:

| Channel | Meaning |
| --- | --- |
| `<name>_target_frequency` | Requested iterations per second. |
| `<name>_actual_frequency` | Observed iterations per second, including failed iterations. |
| `<name>_execution_time` | Smoothed iteration duration in milliseconds, including waits. |
| `<name>_missed_cycles` | Planned iterations skipped because execution fell behind. |
| `<name>_failed_cycles` | Caught execution callback failures. |

Slow functions and `wait` / `wait_until` delay the loop's calling execution path and can cause missed cycles. They do not suspend just one iteration while later iterations continue. Keep repeated work short; [Common Syntax and Functions](Common%20Syntax%20and%20Functions.md#wait-and-wait_until) explains wait behavior, and [Execution and Timing](../Engine/Execution%20and%20Timing.md) explains scheduling costs.

# Reference

- [Loop declaration](Reference/Runtime%20Blocks/runtime-loop.md) — Frequency, diagnostics, and backend behavior.
- [Runtime blocks](Reference/Runtime%20Blocks/Overview.md) — Other kinds of Engine-managed work.
- [Values and Scope](Values%20and%20Scope.md) — Variable ownership and initialization.
