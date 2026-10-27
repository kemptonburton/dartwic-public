---
summary: Understand what Run replaces, how templates create runtime blocks, and what remains after activation.
updated: 2026-10-27T03:06
created: 2026-10-04
---
Runtime blocks are blocks in DCode that register something with the engine when run. Activation installs the Engine-managed work declared by a `.dcode` file: tasks, loops, calculations, task groups, events, and callback registrations.

Runtime blocks are marked by icons in the gutter, and their activation state is displayed in the menu bar, showing if they are loaded into memory or not. The icons will change color based on their state. Green indicates running, Grey indicates loaded but not running, and Yellow indicates stale/ not loaded.

![](_attachments/Pasted%20image%2020261026135823.png)


**Run activates the whole file.** Saving an edit alone does not replace the loaded definitions. Running it again replaces its runtime definitions, including ones whose text did not change.

# Activation and Replacement

Activation registers the runtime blocks declared in a file. Reactivating it applies your edits by replacing that file's previous definitions.

Activate this file and watch its output:

```dcode
loop docs_demo_copy 2:
    |docs_demo_copy_value| = |docs_demo_source|
```

The loop runs at a requested 2 Hz. Rename the loop and Run again: the old runtime is removed and the new one starts. Its output channel can remain because channels have a separate lifecycle.

| Declaration | Behavior on successful activation |
| --- | --- |
| `task_periodic`, `task_state_machine`, `task_sequence`, `task_timeline` | Previous tasks from the file are stopped and removed, then the current declarations are registered. Surviving tasks that were running are restarted. |
| `callback` | Registration is replaced. Accepted calls finish on their captured version; new calls use the replacement. Removed callbacks reject new calls. |
| `loop` | Previous loops from the file are stopped and removed, then the current loops are created and started. |
| `channel_calculation` | Previous calculations from the file are removed, then the current calculation handlers and dependencies are installed. |
| `task_group` | Affected groups are released, then current group declarations are configured against the new task definitions. Removed groups stay released. This can include a group that references a replaced task. |
| `event` | Current declarations update or create event handlers. Declarations removed from the file are deactivated. Existing ARGUS event records and history are retained. |

Runtime declarations are tracked by the source file's path. Rerunning one file does not sweep the runtime declarations owned by every other script.

Removing or renaming a declaration therefore removes its old runtime when the file is successfully activated again. Tasks use their normal task or group lifecycle controls. Loops start on activation, and calculations respond to their configured signal updates.

Editing or saving source alone does not replace the active runtime. As described in [Overview](Overview.md), When edits are made, the script will have to be re executed to rewrite what the engine has loaded in memory.

![](_attachments/Pasted%20image%2020261026140141.png)

In the photo above, the YAML that drives the templated loops has been changed, which requires the script to be ran again.
# Runtime State

Replacement creates fresh task, loop, calculation, and file-global state. An unchanged loop is rebuilt too, so its `once` initialization can run again. A restarted task runs its start lifecycle rather than continuing its old sequence position. Channel values have a separate lifetime and can remain available to the replacement; [Values and Scope](Values%20and%20Scope.md) explains the owners.

Starting the replacement does not grant authority: reacquire available claims with `command` or `set` in `start:` or beside writes. Configured channel startup values apply only at Engine startup, not script reactivation.

Accepted callback calls finish on their captured version; new calls use the replacement registration. Callbacks use their caller's authority; replacing or removing their registration does not release the caller's claims. [Callbacks](Callbacks.md) covers their per-call scope.

# Template Activation

Templates expand into runtime declarations before activation. Each generated block belongs to the `.dcode` file containing the template, even when its entries come from YAML.

For example, this file creates one loop per valve:

```dcode
params = yaml "./valves.yaml#valves"

template(params) loop {params.valve}_sm 10 disable_warnings:
    |valves_{params.valve}_state| = |valves_{params.valve}|
```

If `valves.yaml` contains `valve_1` through `valve_5`, activation creates five loops. Deleting `valve_5` from YAML leaves the old loop active until the consuming script is rerun. Successful activation then stops the previous five loops and creates four. `valve_5_sm` is no longer registered, and the other four loops have fresh runtime state.

The YAML editor's **Run** button saves the YAML and reruns the scripts that use it. Each consuming script activates separately, replacing all of its runtime definitions. 

![](_attachments/Pasted%20image%2020261026143006.png)

# Cleanup and Retained Data

Removing or replacing a runtime stops or retires its active work before cleanup completes.

Tasks, loops, calculations, and events release all of their channel claims after active work and applicable lifecycle handling finish. Other controllers' claims and operator control are preserved. See the [channel cleanup rules](../Engine/Channels%20and%20Control.md#stop) for each policy and override.

Functions and callbacks use their caller's authority; removing a callback registration does not release the caller's claims. Independent background callbacks have no inherited task authority. Task groups own scheduling arrangements, not channel claims; removing a group releases the grouping rather than removing its members.

Runtime replacement is not a general cleanup of obsolete RAPID channels. Application channels such as `valves_valve_5`, `valves_valve_5_open`, and `valves_valve_5_state` can remain after the valve's loop is removed. Loop diagnostic channels can remain too. After a while, this can leave behind a lot of orphaned channels. See how to preform a Channel Cleanup in [Node, Context, and Project Board](../Interface/Node,%20Context,%20and%20Project%20Board.md).

ARGUS event history also remains. Removing an `event` declaration disables its DCode handler; it does not erase the event's recorded history or existing board record.

# Activation Errors and Limits

Parsing and compilation happen before the old runtime is replaced. A failure in those stages leaves the previous runtime installed. With the Lua backend, the old version also remains active while the new file prelude initializes; a prelude failure leaves it installed, although initialization may already have performed channel writes or other actions.

Once replacement begins, a later activation failure is not guaranteed to restore the previous runtime. Check the activation result before assuming the edited version is running.

A running timeline must be held before hot reload. Native C++ currently requires at least one runtime block, so removing its last declaration and pressing Run does not clear the previous runtime through an empty activation. See [Native C++ Execution](Native%20C%2B%2B%20Execution.md) for backend limits.

# Reference

- [Runtime blocks](Reference/Runtime%20Blocks/Overview.md) — Declarations and their lifecycle.
- [Callbacks](Reference/Runtime%20Blocks/runtime-callback.md) — Registration and calls during replacement.
- [Timelines](Timelines.md) — Clock holds and recovery when reactivating a timeline.
