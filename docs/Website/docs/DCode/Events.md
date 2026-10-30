---
summary: Declare stable ARGUS events and react synchronously to firing conditions.
updated: 2026-10-29T02:03
created: 2026-09-04T17:13
---

An event reports a condition or occurrence that an operator may need to review. Use a maintained condition for a limit that can stay active, or a one-shot event for something that happened once. Events can also run DCode reactions.

# Event Configuration

Give the declaration a unique key, title, description, and suggested resolution. Types are `message`, `warning`, `error`, and `abort`; the default is `message`. ARGUS groups reports by node, title, system, and subsystem. Changing that combination creates a different logical event.

## Limit event example

Create `docs_demo_pressure` and `docs_demo_pressure_limit`, plus a free `docs_demo_fuel_valve` channel in a test project. This example has no hardware connection:

```dcode
event docs_demo_pressure_abort:
    title: "Pressure limit exceeded"
    type: abort
    description: "Measured pressure is above the configured limit."
    resolution: "Inspect the cause and verify the system before restarting."
    system: "DEMO"
    subsystem: "PRESSURE"
    firing_timeout_seconds: 0
    channels: |docs_demo_pressure|, |docs_demo_pressure_limit|

    trigger:
        if |docs_demo_pressure| > |docs_demo_pressure_limit|:
            return 1
        return 0

    on_firing:
        if value == 1:
            override |docs_demo_fuel_valve| = 0
        if value == 0:
            free |docs_demo_fuel_valve|
```

Activate below the limit, then raise pressure. The reaction overrides the valve channel to 0. Lower pressure to release the override; its last value stays at 0. An `abort` event does not automatically stop tasks or command equipment; its reaction defines those actions.

## Event details and graphs

The `channels:` field adds event graphs: commas add series, semicolons add graphs, and `@1` through `@5` select a Y axis:

```dcode
channels: |temperature|@1, >100@1; |pressure|@1, =50@2
```

# Event Lifecycle

Activation installs the trigger and reactions and evaluates the trigger once. Subsequent input writes cause reevaluation.

Trigger and reaction calculations share the event's authority. Clearing a condition, acknowledging, or silencing does not automatically release channel claims; use `free` in the reaction when control should end.

Removing the declaration and reactivating disables its handlers. Existing ARGUS board records and history remain. See [shared artifact cleanup](../Engine/Modules%20and%20Tasks.md#removal-and-replacement) for authority and channel retention, and [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) for file replacement.

# Event Execution

Triggers and reactions run **synchronously**: the writing code waits for them to finish. Keep them short; waits and slow functions delay that code too.

## Maintained conditions

Return numeric `1` from `trigger:` for active and `0` for inactive. Every evaluation returning 1 adds a detection and refreshes the configured inactivity deadline. Repeated detections during one continuous firing aggregate into one occurrence. Returning 0 ends the declaration's firing and runs its falling reaction once.

Static pipe reads establish dependencies. Runtime-built channel names need explicit static inputs to trigger reevaluation; template-generated names are detected after expansion. See [Channel Calculations](Channel%20Calculations.md#dependencies).

## Trigger a one-shot event

The `trigger` keyword reports a detection directly; no `trigger:` section is required:

```dcode
event docs_demo_checkpoint:
    title: "Checkpoint reached"
    type: message
    firing_timeout_seconds: 5

task_sequence docs_demo_checkpoint_run:
    trigger docs_demo_checkpoint
```

Activate and start **docs_demo_checkpoint_run**. Each `trigger` requests one detection directly. This example's configured timeout keeps firing active for five seconds after the latest detection.

Add an empty `trigger:` section if you also want the writable pulse input `docs_demo_checkpoint_trigger`. Writing `1` requests a detection, then the Engine resets `_trigger` to `0`. Calculated assertions also reset. That reset, or a direct write of `0`, does not stop firing. Observe `_firing` for the maintained state.

The keyword also works with a non-empty `trigger:` body. There is no independent pulse duration; the declaration's timeout, condition transitions and explicit stops determine when firing ends.

## Event reactions

Use `on_firing:` for firing transitions and `on_event:` for board presence, including silence. They receive `value`/`new_value` and `current_value`; their returns do not replace diagnostic values.

Static input reads can rerun a reaction without a state transition. These dependency calls pass the existing event state as all three arguments and leave its timestamp unchanged.

## Trigger errors

An error or a result that does not resolve to 1 clears the maintained condition. Return numbers: Lua accepts numeric strings and diagnoses missing returns as nonnumeric; Native C++ rejects numeric strings and treats missing returns as no result.

## Reports without a declaration

For a report without generated channels, call a reporting function from an executable body:

```dcode
warning("Pressure high", "Inspect the sensor", [], "", 0, 5)
```

The final 5 is its firing timeout; omitting it also uses five seconds. These calls return a numeric result, normally 1, without waiting for an operator or returning an event ID. Successful `error(...)` reporting lets execution continue; invalid arguments or host failures can still raise errors. `abort(...)` does not automatically stop tasks. Reporting the same identity through a generic function does not renew a declaration's firing deadline, invoke its reactions or grant its authority.

# Event State

ARGUS tracks firing separately from presence on the operator board. Acknowledgement does not clear a condition; resolution requires firing to stop. Later triggers reopen or refresh the same keyed event. See [Events in the Interface](../Interface/Events%20and%20Logs.md#events) for operator controls.

## Generated channels

For the limit example:

| Channel | Meaning |
| --- | --- |
| `docs_demo_pressure_abort_firing` | Observe-only: 1 while the declaration is firing. |
| `docs_demo_pressure_abort` | Observe-only: 1 while present on the active ARGUS board; 0 when silenced. |
| `docs_demo_pressure_abort_trigger` | Writable pulse input, created by `trigger:`. Assertions reset to 0, including calculated assertions; it does not display the maintained firing state. |

## Firing timeout and explicit stop

`firing_timeout_seconds` controls inactivity expiry for the declaration and its generated firing channel:

| Setting | Behavior |
| --- | --- |
| `0` | Default for declarations. Requires a false trigger condition or explicit stop. |
| Positive interval | Ends firing after that many seconds without a declaration detection, even if the last trigger evaluation returned 1. |

Use `stop_event_firing("Pressure limit exceeded", "DEMO", "PRESSURE")` to end the matching locally owned firing. System/subsystem default to `SOFTWARE`/`DCODE`. It returns whether firing ended; an absent or repeated stop is harmless. The event remains on the board with its history and operator status. A later detection starts another occurrence.

Condition transitions and explicit stops run reactions synchronously. Inactivity expiry runs asynchronously. Holds and prompts have no firing-timeout argument: release or response ends their firing and wait. Stopping their firing alone does not complete the workflow.

# Reference

- [Event declaration](Reference/Runtime%20Blocks/runtime-event.md) — Triggering and lifecycle rules.
- [Event metadata](Reference/Fields/Overview.md) — Fields, defaults, and graph settings.
- [Event reactions](Reference/Handlers/handler-event_on_firing.md) — Arguments, dependencies, and generated state.
- [Trigger statement](Reference/Statements/statement-trigger_event.md) — One-shot firing.
- [Reporting functions](Reference/DCode%20Functions/Overview.md) — Exact arguments and backend behavior.
