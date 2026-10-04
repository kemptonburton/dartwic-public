---
updated: 2026-06-21T01:48
created: 2026-06-21
---

DCode files live in a project's `scripts` directory and use the `.dcode` extension.

# Minimal Task

```dcode
task_periodic tasks/heartbeat:
    task elapsed_seconds:
        |demo/heartbeat.value| = elapsed_seconds
```

Activating this file creates a CAESAR task named `tasks/heartbeat`. Each loop writes the elapsed task time into `demo/heartbeat.value`.

# Channel Reads And Writes

Pipe syntax is the most direct way to work with RAPID values:

```dcode
local raw = |demo/raw.value|
|demo/filtered.value| = raw * 0.5
```

The explicit forms are also available:

```dcode
local raw = queryPath("demo/raw.value")
upsertChannelPath("demo/filtered.value", raw * 0.5)
```

# Local, Global, And Task State

Use `local` for temporary values that only matter inside the current block:

```dcode
task_periodic tasks/filter:
    task elapsed_seconds:
        local raw = |demo/raw.value|
        local scaled = raw * 0.5
        |demo/scaled.value| = scaled
```

Bare assignments create names on the script/module table. That is useful for imported helpers, but avoid it for throwaway task values:

```dcode
gain = 0.2

function scale(value):
    return value * gain
```

Inside a task, use `state` for values that should survive from one loop call or state execution to the next:

```dcode
task_periodic tasks/counter:
    start:
        state.count = 0

    task elapsed_seconds:
        state.count = state.count + 1
        |demo/count.value| = state.count
```

# Blocks

A `.dcode` file can contain multiple top-level blocks:

```dcode
task_periodic tasks/filter:
    task elapsed_seconds:
        |demo/filtered.value| = |demo/raw.value| * 0.5

channel_calculation demo/scaled:
    return |demo/filtered.value| * 100
```

# Tank Filling Example

This example combines a state machine for the automatic sequence with a periodic monitor that raises ARGUS events from sensor values.

```dcode
task_state_machine tasks/tank_fill:
    states:
        idle
        awaiting_operator
        filling
        settling
        complete
        faulted

    state idle:
        |tank/inlet_open.value| = false
        |tank/pump_enabled.value| = false

        if |tank/start_auto.value|:
            transition awaiting_operator

    state awaiting_operator:
        local approved = promptYesNo(
            "Start tank fill",
            "Confirm the tank is lined up and ready to fill.",
            {"tank/level.value", "tank/inlet_open.value"},
            "Approve fill sequence."
        )

        if approved:
            transition filling
        else:
            transition idle

    state filling:
        |tank/inlet_open.value| = true
        |tank/pump_enabled.value| = true

        if |tank/high_high_level.value|:
            error(
                "Tank high-high level",
                "Fill sequence stopped because the high-high level switch is active.",
                {"tank/level.value", "tank/high_high_level.value"},
                "Verify the level transmitter and close the inlet."
            )
            transition faulted

        if |tank/level.value| >= |tank/target_level.value|:
            transition settling

    state settling:
        |tank/inlet_open.value| = false
        |tank/pump_enabled.value| = false

        if |tank/flow.value| <= 0.1:
            transition complete

    state complete:
        message(
            "Tank fill complete",
            "The tank reached target level and flow has settled.",
            {"tank/level.value", "tank/target_level.value"},
            "Review final level."
        )
        transition idle

    state faulted:
        |tank/inlet_open.value| = false
        |tank/pump_enabled.value| = false

        if |tank/reset_fault.value|:
            transition idle

task_periodic tasks/tank_sensor_monitor:
    task elapsed_seconds:
        if |tank/level.value| >= |tank/high_level_warning.value|:
            warning(
                "Tank level approaching limit",
                "Tank level is above the warning threshold.",
                {"tank/level.value", "tank/high_level_warning.value"},
                "Check fill sequence and operator lineup."
            )

        if |tank/pressure.value| > |tank/pressure_limit.value|:
            error(
                "Tank pressure over limit",
                "Tank pressure exceeded the configured limit.",
                {"tank/pressure.value", "tank/pressure_limit.value"},
                "Stop fill and investigate pressure source."
            )
```

# Validation

Use the DCode editor's diagnostics before activating a script. Validation runs through the same parser used by the runtime activation path.
