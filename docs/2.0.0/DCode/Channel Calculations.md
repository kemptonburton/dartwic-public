---
updated: 2026-06-23T03:52
created: 2026-06-21
---

Use `channel_calculation` when one channel value should be derived from another channel value.

# Basic Shape

```dcode
channel_calculation tank/level_percent:
    local level = |tank/level.value|
    local capacity = |tank/capacity.value|
    return clamp((level / capacity) * 100, 0, 100)
```

# Dependencies

DCode automatically detects dependencies from pipe reads and `queryPath(...)` calls. You can add explicit dependencies with `depends_on:`.

```dcode
channel_calculation tank/level_percent:
    depends_on: tank/level, tank/capacity
    return clamp((|tank/level.value| / |tank/capacity.value|) * 100, 0, 100)
```

Dependencies use channel keys like `portal/channel`, not field paths like `portal/channel.value`.

Dynamic pipe paths such as `|tank/{name}_pressure.value|` are built at runtime, so DCode does not treat them as static calculation dependencies. Add any channels that should trigger the calculation with `depends_on:`.

# Execution

`channel_calculation` blocks are not CAESAR tasks and do not create `_running`, `_target_frequency`, or `_actual_frequency` channels. A calculation registers itself against its target channel and dependency channels:

- writes to the target channel run calculations attached to that target before the value is committed
- writes to dependency channels run dependent calculations after the dependency value is committed
- calculation results are written to the target channel's `.value`

For example, this calculation reruns when `tank/level.value` or `tank/capacity.value` changes, then writes `tank/level_percent.value`:

```dcode
channel_calculation tank/level_percent:
    depends_on: tank/level, tank/capacity
    return clamp((|tank/level.value| / |tank/capacity.value|) * 100, 0, 100)
```

# Circular Dependencies

Avoid circular calculation graphs. DCode tracks active calculation propagation and stops a calculation if evaluating it would re-enter the same calculation.

This is circular:

```dcode
channel_calculation tank/level_percent:
    depends_on: tank/level_scaled
    return |tank/level_scaled.value| * 100

channel_calculation tank/level_scaled:
    depends_on: tank/level_percent
    return |tank/level_percent.value| / 100
```

When a cycle is detected, DCode logs a cycle error and leaves the current value unchanged for the calculation that could not complete. Break the cycle by making one channel the source of truth, or by moving sequenced logic into a `task_periodic` or `task_state_machine` block.

# Return Value

Calculations must return a number. If the calculation fails or returns a non-number, DCode leaves the current value unchanged and records the calculation error.
