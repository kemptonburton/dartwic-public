---
summary: Understand what Run replaces, how templates create runtime blocks, and what remains after activation.
updated: 2026-10-14T20:57
created: 2026-10-04
---

A runtime block declares work managed by the engine: a task, loop, channel calculation, task group, or event. That work belongs to the `.dcode` file that declares it and can remain active after Run finishes or the editor tab closes. An ordinary `if`, `for`, or function inside a block does not create a separate engine runtime.

In the script editor, **Run activates the file**. Running the same file again replaces its existing runtime definitions with the definitions produced by the current source and template data. This applies to the whole file, including blocks whose text has not changed.

## What rerunning replaces

| Declaration | Behavior on successful activation |
| --- | --- |
| `task_periodic`, `task_state_machine`, `task_sequence`, `task_timeline` | Previous tasks from the file are stopped and removed, then the current declarations are registered. Surviving tasks that were running are restarted. |
| `callback` | Registration is replaced. Accepted calls finish on their captured version; new calls use the replacement. Removed callbacks reject new calls. |
| `loop` | Previous loops from the file are stopped and removed, then the current loops are created and started. |
| `channel_calculation` | Previous calculations from the file are removed, then the current calculation handlers and dependencies are installed. |
| `task_group` | Affected groups are released, then current group declarations are configured against the new task definitions. Removed groups stay released. This can include a group that references a replaced task. |
| `event` | Current declarations update or create event handlers. Declarations removed from the file are deactivated. Existing ARGUS event records and history are retained. |

Ownership is tracked by the source file's path. Rerunning one file does not sweep the runtime declarations owned by every other script.

Removing or renaming a declaration therefore removes its old runtime when the file is successfully activated again. Tasks use their normal task or group lifecycle controls. Loops start on activation, and calculations respond to their configured signal updates.

Editing or saving source alone does not replace the active runtime. A stale indication means the loaded version differs from the current source or dependency data. Run the affected file and inspect the activation result to apply the change.

## State starts again

Callbacks use ordinary per-call function scope; see [Callbacks](Callbacks.md). Their registrations are replaced on activation, while outstanding calls finish on their previous version.

Rebuilt tasks, loops, and calculations receive fresh runtime variables. File-prelude globals also reset on activation. An unchanged loop is still rebuilt, so its `once` initialization can run again. A restarted task runs its start lifecycle again; it does not continue from the old sequence position or retain the old task's local state.

Channel values have a separate lifecycle. A value stored in RAPID can remain available to the new runtime even though the script's variables were recreated. See [Values and Scope](Values%20and%20Scope.md) and [Sequences and Task Lifecycle](Sequences%20and%20Task%20Lifecycle.md).

## Templates follow the same lifecycle

Templates expand into runtime declarations before activation. Each generated block belongs to the `.dcode` file containing the template, even when its entries come from YAML.

For example, this file creates one loop per valve:

```dcode
params = yaml "./valves.yaml#valves"

template(params) loop {params.valve}_sm 10 disable_warnings:
    |valves_{params.valve}_state| = |valves_{params.valve}|
```

If `valves.yaml` contains `valve_1` through `valve_5`, activation creates five loops. Deleting `valve_5` from YAML leaves the old loop active until the consuming script is rerun. Successful activation then stops the previous five loops and creates four. `valve_5_sm` is no longer registered, and the other four loops have fresh runtime state.

The YAML editor's **Run** button saves the YAML and reruns the scripts that use it. Each consuming script activates separately, replacing all of its runtime definitions. If one activation fails, inspect its result; the batch is not a single transaction across every dependent file.

## What can remain afterward

Runtime replacement is not a general cleanup of obsolete RAPID channels. Application channels such as `valves_valve_5`, `valves_valve_5_open`, and `valves_valve_5_state` can remain after the valve's loop is removed. Loop diagnostic channels can remain too. Review unused channels separately before removing them.

Stopping a task or loop releases its automatic channel ownership. That does not itself delete a channel, reset its stored value, or send a physical stop command. Put required output cleanup in the appropriate task lifecycle or driver shutdown behavior. See [Commanding and Control](../Engine/Commanding%20and%20Control.md).

ARGUS event history also remains. Removing an `event` declaration disables its DCode handler; it does not erase the event's recorded history or existing board record.

## Activation failures and limits

Parsing and compilation happen before the old runtime is replaced. A failure in those stages leaves the previous runtime installed. With the Lua backend, the old version also remains active while the new file prelude initializes; a prelude failure leaves it installed, although initialization may already have performed channel writes or other actions.

Once replacement begins, a later activation failure is not guaranteed to restore the previous runtime. Check the activation result before assuming the edited version is running.

A running timeline must be held before hot reload. Native C++ currently requires at least one runtime block or event declaration, so removing its last declaration and pressing Run does not clear the previous runtime through an empty activation. See [Native C++ Execution](Native%20C%2B%2B%20Execution.md) for backend limits.

The [runtime block reference](Reference/Runtime%20Blocks/Overview.md) lists the declaration syntax.
