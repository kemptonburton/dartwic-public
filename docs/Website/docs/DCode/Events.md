---
summary: Declare stable ARGUS events and react synchronously to firing conditions.
updated: 2026-10-26T14:16
created: 2026-09-04T17:13
---

An event reports a condition or occurrence that an operator may need to review. Use a maintained condition for a limit that can stay active, or a one-shot event for something that happened once. An event can also run a DCode reaction.

ARGUS owns the operator board and history. The event's firing condition and its presence on that board are separate states.

# React to a limit

Create `docs_demo_pressure` and `docs_demo_pressure_limit`, plus a free `docs_demo_fuel_valve` channel in a test project. This example uses a demo output with no hardware connection:

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

Activate below the limit, then raise pressure. The condition fires and the reaction holds the valve channel at 0. Lower pressure: the reaction releases its override. Freeing control leaves the last value in place; it does not restore an earlier command. Acknowledging the event does not release an active override.

The trigger evaluates once at activation and then inline when an input dependency is written. Return numeric 1 for active and 0 for inactive. A rising edge fires the event; remaining at 1 does not repeatedly report it or impose a five-second timeout. Keep inline reactions short because they delay the writer.

An `abort` event does not stop every task or command equipment by itself. The reaction, channel authority, driver, and hardware determine the actual response. [Channels and Control](../Engine/Channels%20and%20Control.md) owns those authority rules.

# Generated channels

For the example above:

| Channel | Meaning |
| --- | --- |
| `docs_demo_pressure_abort_firing` | `1` while the maintained condition is asserted or a one-shot pulse is still within its five-second window. Observe-only. |
| `docs_demo_pressure_abort` | Whether the event is present on the active ARGUS board. Observe-only; silenced events report zero. |
| `docs_demo_pressure_abort_trigger` | Writable pulse input, created because the declaration has a `trigger:` section. An assertion automatically resets this input to zero, including a calculated assertion. It does not display the maintained firing state. |

Use `on_firing:` for firing transitions and `on_event:` for board presence, including silence. They receive `value`/`new_value` and `current_value`; do not return a replacement diagnostic value. Static reads add dependencies and can rerun the reaction even without a state change. Such reruns pass the existing state as all three arguments without changing its timestamp.

Acknowledgement does not clear a condition; resolution is allowed once firing stops. A later trigger reopens or refreshes the same keyed event. See [Interface Events](../Interface/Events.md) for operator controls.

# Trigger a one-shot event

Use an empty `trigger:` when an external pulse should report an occurrence:

```dcode
event docs_demo_checkpoint:
    title: "Checkpoint reached"
    type: message
    separation_seconds: 5
    trigger:

task_sequence docs_demo_checkpoint_run:
    trigger docs_demo_checkpoint
```

Activate and start **docs_demo_checkpoint_run**. The `trigger` statement keeps the generated firing channel at 1 for five seconds after the latest pulse. Another pulse refreshes that window. Writing 1 to the generated `_trigger` channel also pulses it; the input resets to 0 automatically. Writing 0 does not cancel a pulse or clear a maintained condition.

Statement-form triggering also works without a `trigger:` section; the empty section creates the writable pulse input. If a declaration uses both maintained and pulse triggers, firing stays active until both are inactive.

# ARGUS quiet expiry

`separation_seconds` controls the ARGUS occurrence's quiet expiry. It is independent of the generated pulse's five-second window:

| Setting | Consequence |
| --- | --- |
| `0` | Disables ARGUS automatic expiry. Use it for maintained conditions. |
| Positive interval | Can expire the occurrence while `_firing` remains 1. It does not extend or shorten the pulse. |

When the maintained condition clears or the final pulse expires, DCode explicitly stops the occurrence even with separation 0. A maintained true condition does not keep submitting reports, so a positive quiet interval can expire its occurrence before the condition clears.

# Event details and graphs

Give the event a title, useful description, and suggested resolution. Types are `message`, `warning`, `error`, and `abort`; the default is `message`. ARGUS groups reports by node, title, system, and subsystem. Changing that tuple creates a different logical event; the declaration key binds its generated channels and reactions.

In `channels:`, commas add series and semicolons add graphs. `@1` through `@5` choose a Y axis. For example:

```dcode
channels: |temperature|@1, >100@1; |pressure|@1, =50@2
```

For a report without generated channels, an executable body can call:

```dcode
warning("Pressure high", "Inspect the sensor", [], "", 0, 5)
```

The final 5 is its quiet interval. These reporting functions use positional arguments and return a numeric host result, normally 1; they do not wait for an operator or return an event ID. `error(...)` reports an event rather than raising an execution exception, and `abort(...)` does not automatically stop tasks. Reporting the same tuple does not grant a declaration's channel authority.

# Handle failures and operator input

Use numeric trigger returns in shared scripts. A non-1 result or error clears the maintained condition. Lua accepts numeric strings and diagnoses null or fallthrough as nonnumeric; Native C++ rejects numeric strings and treats null or fallthrough as no numeric result. Check errors as well as displayed state.

Static reads establish trigger dependencies. Dynamic channel names need explicit static inputs that cause reevaluation; see [Channel Calculations](Channel%20Calculations.md#dependencies).

An event declaration reports a condition; prompts and `hold(...)` are executable calls that wait for operator action. [Scheduling Timelines](Scheduling%20Timelines.md#wait-for-an-operator) explains their effect on buckets and mission time.

# Reference

- [Event declaration](Reference/Runtime%20Blocks/runtime-event.md) — Triggering and lifecycle rules.
- [Event metadata](Reference/Event%20Metadata/Overview.md) — Fields, defaults, and graph settings.
- [Event reactions](Reference/Runtime%20Sections/section-event_on_firing.md) — Arguments, dependencies, and generated state.
- [Trigger statement](Reference/Statements/statement-trigger_event.md) — One-shot firing.
- [Reporting and prompt functions](Reference/DCode%20Functions/Overview.md) — Exact arguments and backend behavior.
