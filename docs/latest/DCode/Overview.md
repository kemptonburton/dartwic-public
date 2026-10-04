---
updated: 2026-07-18T18:24
created: 2026-06-21
---

DCode is DARTWIC's scripting language for small runtime behavior close to RAPID channels, CAESAR tasks, and ARGUS operator events.

# What DCode Is For

- periodic task logic
- state-machine task logic
- channel calculations
- script-local helper modules
- operator prompts and events through ARGUS
- calling runtime-provided native DCode functions

# Code Structure

A DCode file is evaluated as a script module. Imports and helper definitions live at the top level, and runtime behavior lives in one or more top-level blocks.

```dcode
import "./helpers/filter"

local private_gain = 0.2
shared_gain = 0.5

function scale(value):
    return value * shared_gain

task_periodic tasks/filter:
    start:
        state.last = 0

    task elapsed_seconds:
        local raw = |demo/raw.value|
        state.last = filter.low_pass(raw)
        |demo/filtered.value| = scale(state.last)

channel_calculation demo/scaled:
    return |demo/filtered.value| * 100
```

- `import` loads helper modules from the project's `scripts` directory.
- `local` names are private to the current script or function scope.
- Bare assignments and bare functions become module-level names. In helper modules, those names are visible to importers.
- `state` is task runtime storage. Use it for values that should survive between task loop calls or state executions.
- Pipe paths like `|demo/raw.value|` read or write RAPID channel values directly.
- Dynamic pipe paths like `|demo/{name}_state.value|` build the channel path from a variable or expression at runtime.
- Top-level runtime blocks define loaded runtime units: `task_periodic`, `task_state_machine`, `task_sequence`, `channel_calculation`, and `loop`.

Top-level code can run without declaring a task block. This is useful for helper setup, one-shot scripts, or small channel edits:

```dcode
for name in {"alpha", "beta", "gamma"}:
    local command = |demo/{name}_command.value|
    |demo/{name}_state.value| = command
```

# Top-Level Blocks

A DCode block is a top-level runtime declaration. It starts with a block header and owns the indented body beneath it:

```dcode
task_periodic tasks/monitor:
    task elapsed_seconds:
        |demo/heartbeat.value| = elapsed_seconds
```

Blocks are different from imports, variables, and functions:

- `import` loads another script module.
- `local` variables hold private values in the current scope.
- bare assignments such as `gain = 0.2` create module-level names.
- functions define reusable code that can be called by blocks or exported from helper modules.
- blocks define runtime behavior that DARTWIC activates.

In other words, helper code prepares names that the script can use; blocks tell DARTWIC what to run or attach to RAPID.

Use `task_periodic` for repeated CAESAR task logic:

```dcode
task_periodic tasks/monitor:
    task elapsed_seconds:
        |demo/heartbeat.value| = elapsed_seconds
```

Use `task_state_machine` for sequenced behavior with named states and `transition`:

```dcode
task_state_machine tasks/fill:
    states:
        idle
        filling

    state idle:
        if |tank/start.value|:
            transition filling

    state filling:
        if |tank/level.value| >= |tank/target.value|:
            transition idle
```

Use `channel_calculation` for derived channel values:

```dcode
channel_calculation tank/level_percent:
    return (|tank/level.value| / |tank/max_level.value|) * 100
```

# Start Here

1. Read [Getting Started](Getting%20Started.md).
2. Write a small `task_periodic` block.
3. Use pipe syntax to read and write channel values.
4. Add a calculation or state machine only after the basic loop is working.

# Guides

- [Getting Started](Getting%20Started.md)
- [Tasks](Tasks.md)
- [Writing Periodic Tasks](Writing%20Periodic%20Tasks.md)
- [Building State Machines](Building%20State%20Machines.md)
- [Channel Calculations](Channel%20Calculations.md)
- [Modules and Native Functions](Modules%20and%20Native%20Functions.md)

# References

- [DCode Reference Overview](Reference/Overview.md)
- [Runtime Blocks](Reference/Runtime%20Blocks.md)
- [Runtime Sections](Reference/Runtime%20Sections.md)
- [Blocks](Reference/Blocks.md)
- [Statements](Reference/Statements.md)
- [Directives](Reference/Directives.md)
- [Syntax](Reference/Syntax.md)
- [Context Variables](Reference/Context%20Variables.md)
- [DCode Functions](Reference/DCode%20Functions.md)
- [Lua Base](Reference/Lua%20Base.md)
- [Plugin Registration](Reference/Plugin%20Registration.md)
