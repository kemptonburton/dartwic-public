---
summary: Derive channels inline when their inputs change.
updated: 2026-10-22T18:22
created: 2026-08-03T15:41
---

A channel calculation derives a numeric value from other channels. It runs as part of the channel update path, so use it for conversions and immediate reactions that must not wait for a periodic task.

## Derive a value

This example updates a percentage whenever either input changes. Create the two input channels first and use the same units for both.

```dcode
channel_calculation docs_demo_level_percent:
    local capacity = |docs_demo_capacity|
    if capacity <= 0:
        return 0
    return clamp((|docs_demo_level| / capacity) * 100, 0, 100)
```

Here, zero capacity produces zero as an explicit fallback. In a real controller, choose an appropriate invalid-input policy and report the fault separately; a plausible numeric fallback should not hide a failed sensor.

## When it runs

| Update | Calculation behavior |
| --- | --- |
| A write to the calculation's target | Runs the attached calculation before committing the target value. |
| A write to an input dependency | Commits that input, then runs dependent calculations inline before the original write returns. |
| A display refresh or telemetry packet | Does not schedule the local calculation; publication happens separately. |

Accepted equal-valued writes also run the calculation; a change in the numeric value is not required. Ordinary calculations are registered at activation and evaluated by subsequent target/dependency writes. Event trigger calculations additionally evaluate once at activation.

A calculation runs on the thread that writes its channel or dependency. Keep it short: a wait, slow plugin call, or long calculation delays that writer too. Task start/stop channel writes enqueue lifecycle requests; the lifecycle handlers run later on the task or group thread.

If a target calculation fails or produces no numeric result, DCode uses the original value submitted by the writer, subject to channel authority and RAPID's normal numeric channel conversion. Earlier transformations for that target write are discarded and remaining target calculations are skipped. Side effects already performed by calculations are not rolled back.

An ARGUS warning identifies the failed calculation, source location, target, error, writer origin, and submitted fallback value. Native C++ can report a generic calculation failure when no host error text is available. The warning is also printed to the engine console; failure to record the warning does not prevent the fallback. Repeated failures update the same named warning; its firing state expires after five quiet seconds. If a dependency calculation produces no numeric result, it leaves its target unchanged; the input stays committed. Dependency evaluation errors are logged. Calculations are not CAESAR tasks and have no running, hold, or frequency controls.

### Calculation arguments

| Variable | Direct target write | Dependency invocation |
| --- | --- | --- |
| `value`, `new_value` | The proposed target value. | The committed input value that triggered evaluation. |
| `current_value` | The existing target value before evaluation. | The target value read before evaluation. |

Read named input pipes when a formula needs particular signals; `value` does not always mean the target's current value. Reads use live channel state, so the inline chain is not an atomic snapshot across several channels.

See [Execution and Timing](../Engine/Execution%20and%20Timing.md) when the calculation participates in a control cycle.

## Dependencies

Both examples can use [Native C++](Native%20C%2B%2B%20Execution.md). Static value pipes use prepared bindings; the dynamic-name example resolves its channel through the host at runtime.

Static pipe reads in the body automatically become dependencies. They subscribe to channel value writes; changing only a metadata field does not invoke the calculation. Assignment targets are outputs. An explicit list can add dependencies:

```dcode
channel_calculation docs_demo_selected_pressure:
    depends_on: docs_demo_left_pressure, docs_demo_right_pressure
    local side = "left"
    return |docs_demo_{side}_pressure|
```

Dynamic references are resolved at runtime and are not discovered as static inputs. List every channel that should cause reevaluation, including any selection channel. Entries in `depends_on` are channel keys, without pipe delimiters or metadata-field suffixes.

## Errors and cycles

Return a number for portable behavior. A failed, null, missing, or other nonnumeric target result uses the original submitted value and reports the warning described above in both backends. Native C++ treats `return null` or falling through as no result; Lua diagnoses it as a nonnumeric-result error. On dependency invocations, native null/fallthrough quietly skips target publication, while Lua logs its error. Lua also accepts numeric strings through its numeric conversion, which Native C++ rejects. Use numeric returns in shared scripts; an old displayed target does not prove the latest evaluation succeeded.

Keep dependencies one-way. If a chain would reenter a calculation already executing, DCode skips that evaluation and records a cycle error. It does not undo accepted writes earlier in the chain. Make one channel the source of truth, or use a [periodic task](Writing%20Periodic%20Tasks.md) when the intended behavior depends on previous iterations.
