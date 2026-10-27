---
summary: Declare stable ARGUS events and react synchronously to firing conditions.
updated: 2026-10-27T04:26
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
    separation_seconds: 0
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

Removing the declaration and reactivating disables its handlers. Removal or replacement releases its claims after active work finishes. Generated channels, stored values, existing board records, and history remain. See the [channel cleanup rules](../Engine/Channels%20and%20Control.md#stop) and [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md).

# Event Execution

Triggers and reactions run **synchronously**: the writing code waits for them to finish. Keep them short; waits and slow functions delay that code too.

## Maintained conditions

Return numeric `1` from `trigger:` for active and `0` for inactive. A rising edge fires the event. Staying at 1 does not repeatedly report it.

Static pipe reads establish dependencies. Runtime-built channel names need explicit static inputs to trigger reevaluation; template-generated names are detected after expansion. See [Channel Calculations](Channel%20Calculations.md#dependencies).

## Trigger a one-shot event

An empty `trigger:` creates a writable pulse input:

```dcode
event docs_demo_checkpoint:
    title: "Checkpoint reached"
    type: message
    separation_seconds: 5
    trigger:

task_sequence docs_demo_checkpoint_run:
    trigger docs_demo_checkpoint
```

Activate and start **docs_demo_checkpoint_run**. The `trigger` statement asserts firing for five seconds after the latest pulse. Writing 1 to `_trigger` also pulses it; that input resets to 0 automatically. Writing 0 does not cancel a pulse or clear a maintained condition.

The statement also works without a `trigger:` section. If maintained and pulse triggers are both used, firing stays active until both are inactive.

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

The final 5 is its quiet interval. These calls return a numeric result, normally 1, without waiting for an operator or returning an event ID. `error(...)` reports an event rather than raising an exception; `abort(...)` does not automatically stop tasks. Reporting the same event does not grant its declaration's authority.

# Event State

ARGUS tracks firing separately from presence on the operator board. Acknowledgement does not clear a condition; resolution requires firing to stop. Later triggers reopen or refresh the same keyed event. See [Interface Events](../Interface/Events.md) for operator controls.

## Generated channels

For the limit example:

| Channel | Meaning |
| --- | --- |
| `docs_demo_pressure_abort_firing` | Observe-only: 1 while a maintained condition or unexpired pulse is active. |
| `docs_demo_pressure_abort` | Observe-only: 1 while present on the active ARGUS board; 0 when silenced. |
| `docs_demo_pressure_abort_trigger` | Writable pulse input, created by `trigger:`. Assertions reset to 0, including calculated assertions; it does not display the maintained firing state. |

## ARGUS quiet expiry

`separation_seconds` controls occurrence expiry, independently of the five-second pulse window:

| Setting | Behavior |
| --- | --- |
| `0` | Disables automatic expiry. Use for maintained conditions. |
| Positive interval | Can expire the occurrence while `_firing` remains 1; does not change pulse duration. |

When neither a maintained condition nor an unexpired pulse is active, DCode stops the occurrence, even with separation 0. A maintained true condition does not repeatedly report, so a positive quiet interval can expire its occurrence before the condition clears.

# Reference

- [Event declaration](Reference/Runtime%20Blocks/runtime-event.md) — Triggering and lifecycle rules.
- [Event metadata](Reference/Fields/Overview.md) — Fields, defaults, and graph settings.
- [Event reactions](Reference/Handlers/handler-event_on_firing.md) — Arguments, dependencies, and generated state.
- [Trigger statement](Reference/Statements/statement-trigger_event.md) — One-shot firing.
- [Reporting functions](Reference/DCode%20Functions/Overview.md) — Exact arguments and backend behavior.
