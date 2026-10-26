---
summary: Derive channels inline when their inputs change.
updated: 2026-10-26T14:16
created: 2026-08-03T15:41
---

A channel calculation derives a number from live inputs, such as a unit conversion or a level percentage. It runs inline in the channel-write path, so use it when the result should follow accepted input writes without waiting for a scheduled task.

# Derive a value

This example updates a percentage whenever either input changes. Create the two input channels first and use the same units for both.

```dcode
channel_calculation docs_demo_level_percent:
    local capacity = |docs_demo_capacity|
    if capacity <= 0:
        return 0
    return clamp((|docs_demo_level| / capacity) * 100, 0, 100)
```

Here, zero capacity produces zero as an explicit fallback. In a real controller, choose an appropriate invalid-input policy and report the fault separately; a plausible numeric fallback should not hide a failed sensor.

Activate the file and update `docs_demo_level` or `docs_demo_capacity`. Inspect `docs_demo_level_percent`; it should remain between 0 and 100.

# When it runs

| Update | Calculation behavior |
| --- | --- |
| A write to the calculation's target | Runs the attached calculation before committing the target value. |
| A write to an input dependency | Commits that input, then runs dependent calculations inline before the original write returns. |
| A display refresh or telemetry packet | Does not schedule the local calculation; publication happens separately. |

Accepted equal-valued writes also run the calculation; a change in the numeric value is not required. Ordinary calculations are registered at activation and evaluated by subsequent target/dependency writes. Event trigger calculations additionally evaluate once at activation.

A calculation runs on the thread that writes its channel or dependency. Keep it short: a wait, slow plugin call, or long calculation delays that writer too. Task start/stop channel writes enqueue lifecycle requests; the lifecycle handlers run later on the task or group thread.

Use [timed `when` and `once when` blocks](Common%20Syntax%20and%20Functions.md#require-a-sustained-condition) to require a condition for a duration without waiting inside the calculation. Timing state persists between evaluations, but a deadline alone does not schedule another evaluation. Include any sensor-quality checks in the condition.

## Calculation arguments

| Variable | Direct target write | Dependency invocation |
| --- | --- | --- |
| `value`, `new_value` | The proposed target value. | The committed input value that triggered evaluation. |
| `current_value` | The existing target value before evaluation. | The target value read before evaluation. |

Read named input pipes when a formula needs particular signals; `value` does not always mean the target's current value. Reads use live channel state, so the inline chain is not an atomic snapshot across several channels.

See [Execution and Timing](../Engine/Execution%20and%20Timing.md) when the calculation participates in a control cycle.

# Dependencies

Both examples can use [Native C++](Native%20C%2B%2B%20Execution.md). Static value pipes use prepared bindings; the dynamic-name example resolves its channel through the host at runtime.

Static pipe reads in the body automatically become dependencies. They subscribe to channel value writes; changing only a metadata field does not invoke the calculation. Assignment targets are outputs. An explicit list can add dependencies:

```dcode
channel_calculation docs_demo_selected_pressure:
    depends_on: docs_demo_left_pressure, docs_demo_right_pressure
    local side = "left"
    return |docs_demo_{side}_pressure|
```

Dynamic references are resolved at runtime and are not discovered as static inputs. List every channel that should cause reevaluation, including any selection channel. Entries in `depends_on` are channel keys, without pipe delimiters or metadata-field suffixes.

# Errors and cycles

| Invocation | If the calculation fails or returns no numeric result |
| --- | --- |
| A direct write to the target | Uses the original submitted value, subject to authority and normal numeric conversion. Earlier transformations are discarded and later target calculations are skipped. |
| A dependency update | Leaves the target unchanged; the input remains committed. Evaluation errors are logged. |

Side effects already performed are not rolled back. A direct-write fallback produces an ARGUS warning identifying the calculation, source, target, error, writer, and fallback value. Native C++ may provide generic failure text. The console also reports it; warning-storage failure does not prevent the fallback. Repeated failures update the same warning, whose firing expires after five quiet seconds.

Return a number for portable behavior. Lua logs null/fallthrough as a nonnumeric-result error and accepts numeric strings; Native C++ treats null/fallthrough as no result and rejects numeric strings. An old displayed target does not establish that the latest evaluation succeeded.

Keep dependencies one-way. DCode skips an evaluation that would reenter an already executing calculation and records a cycle error. Earlier writes remain. Use a [periodic task](Tasks.md) when the logic depends on previous iterations. Calculations have no task running, hold, or frequency controls.

# Reference

- [Channel calculation](Reference/Runtime%20Blocks/runtime-channel_calculation.md) — Declaration, invocation, and result rules.
- [Explicit dependencies](Reference/Runtime%20Sections/section-depends_on.md) — Adding inputs for reevaluation.
- [Calculation body](Reference/Runtime%20Sections/section-calculation_body.md) — Available calculation arguments.
