---
summary: Derive channels inline when their inputs change.
updated: 2026-10-27T20:40
created: 2026-08-03T15:41
---

A channel calculation derives a number from live inputs, such as a unit conversion or a level percentage. It runs synchronously in the channel-write path, so use it when the result should follow accepted input writes without waiting for a scheduled task.

# Calculation Configuration

The name after `channel_calculation` is the output channel. Return a number to supply its value. Static input pipes establish dependencies automatically; use `depends_on` for additional inputs.

This example updates a percentage whenever either input changes. Create the two input channels first and use the same units for both.

```dcode
channel_calculation docs_demo_level_percent:
    local capacity = |docs_demo_capacity|
    if capacity <= 0:
        return 0
    return clamp((|docs_demo_level| / capacity) * 100, 0, 100)
```

Zero capacity returns zero here. Choose an appropriate fallback for your application and report invalid inputs separately so the result does not hide a sensor fault.

Activate the file and update `docs_demo_level` or `docs_demo_capacity`. Inspect `docs_demo_level_percent`; it should remain between 0 and 100.

# Calculation Lifecycle

Activation installs the calculation and its dependencies; ordinary calculations first evaluate on a subsequent target or dependency write. Event trigger calculations also evaluate once at activation.

Each calculation has its own runtime block scope, but unlike a function or a callback, its variables persist between evaluations. Assignments still run each time and can overwrite previous values. To share variables between calculations in the same file, define them at file scope and declare `global` inside each calculation that uses them. See [Values and Scope](Values%20and%20Scope.md#variable-scopes).

Reactivating the file replaces the calculation with fresh variable state; removing its declaration and reactivating removes it. The [shared removal rules](../Engine/Modules%20and%20Tasks.md#removal-and-replacement) explain authority cleanup and retained channels.

# Calculation Execution

Calculations run **synchronously**: the writing code waits for calculations and reactions to finish before its write call returns. Keep them short; waits and slow functions delay that code too.

| Channel written | Order |
| --- | --- |
| Calculation's output | Calculate, then store the output. |
| Input dependency | Store the input, calculate, then store the output. |

Equal-valued writes also trigger evaluation. Metadata changes, display refreshes, and telemetry packets do not.

A [timed `when` block](Common%20Syntax%20and%20Functions.md#when-blocks) can qualify a condition without waiting, but time passing alone does not trigger another evaluation.

## Dependencies

A dependency is an input channel whose value writes trigger the calculation. Static pipe reads register dependencies automatically; assignment targets are outputs.

Template-generated names are detected automatically after expansion. Names built from runtime variables need explicit `depends_on` entries. List each input that should trigger evaluation, including any selection channel, using channel keys without pipes or metadata suffixes:

```dcode
channel_calculation docs_demo_selected_pressure:
    depends_on: docs_demo_left_pressure, docs_demo_right_pressure
    local side = "left"
    return |docs_demo_{side}_pressure|
```

Both examples work in Lua and [Native C++](Native%20C%2B%2B%20Execution.md).

## Calculation Arguments

These arguments describe the write that caused evaluation:

| Variable | Direct output write | Dependency write |
| --- | --- | --- |
| `value`, `new_value` | Proposed output value. | Stored input value that triggered evaluation. |
| `current_value` | Target value before evaluation. | Target value before evaluation. |

Read named input pipes when you need particular signals. Reads use live values, not a simultaneous snapshot of every input. See [Execution and Timing](../Engine/Execution%20and%20Timing.md) for control-cycle timing.

# Errors and Cycles

A calculation must return a number. If it fails or produces no numeric result, behavior depends on which channel was written:

| Write | Result on failure |
| --- | --- |
| Calculation's output | Falls back to the original submitted value, subject to authority checks and numeric conversion. Discards earlier calculation results and skips remaining target calculations. |
| Input dependency | Keeps the input write; leaves the output unchanged. Evaluation errors are logged. |

Earlier writes and other side effects remain. Direct-write fallbacks produce an ARGUS warning and console report. Use numeric values rather than numeric strings; Lua and Native C++ handle strings and missing returns differently.

A cycle occurs when calculations feed back into one already executing. DCode skips that reentry and records an error. Keep dependencies one-way; use a [periodic task](Tasks.md) for iterative logic.

# Reference

- [Channel calculation](Reference/Runtime%20Blocks/runtime-channel_calculation.md) — Declaration, invocation, and result rules.
- [Explicit dependencies](Reference/Fields/field-depends_on.md) — Adding inputs for reevaluation.
