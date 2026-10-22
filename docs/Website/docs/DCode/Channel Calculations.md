---
summary: Derive channels inline when their inputs change.
updated: 2026-10-14T15:07
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

A calculation runs on the thread that writes its channel or dependency. Keep it short: a wait, slow plugin call, or long calculation delays that writer too. Task start/stop channel writes enqueue lifecycle requests; the lifecycle handlers run later on the task or group thread.

If a target transformation fails, its proposed write is rejected. If a dependent calculation fails after an input was accepted, that input stays committed. Calculations are not CAESAR tasks and have no running, hold, or frequency controls.

See [Execution and Timing](../Engine/Execution%20and%20Timing.md) when the calculation participates in a control cycle.

## Dependencies

Both examples can use [Native C++](Native%20C%2B%2B%20Execution.md). Static value pipes use prepared bindings; the dynamic-name example resolves its channel through the host at runtime.

Static pipe reads in the body automatically become dependencies. Assignment targets are outputs. An explicit list can add dependencies:

```dcode
channel_calculation docs_demo_selected_pressure:
    depends_on: docs_demo_left_pressure, docs_demo_right_pressure
    local side = "left"
    return |docs_demo_{side}_pressure|
```

Dynamic references are resolved at runtime and are not discovered as static inputs. List every channel that should cause reevaluation, including any selection channel. Entries in `depends_on` are channel keys, without pipe delimiters or metadata-field suffixes.

## Errors and cycles

Return a number. A failed calculation or nonnumeric result leaves the existing value unchanged and records an error; a displayed old value is not proof that the latest calculation succeeded.

Keep dependencies one-way. If a chain would reenter a calculation already executing, DCode logs a cycle error and leaves that calculation's current value unchanged. Make one channel the source of truth, or use a [periodic task](Writing%20Periodic%20Tasks.md) when the intended behavior depends on previous iterations.
