---
summary: Declare stable ARGUS events and react synchronously to firing conditions.
updated: 2026-10-22T17:50
created: 2026-09-04T17:13
---

Declare an event when a condition needs operator-visible details and reusable automation hooks. The declaration key binds its generated channels and reactions. ARGUS groups reports by node, title, system, and subsystem; changing any of those fields starts a different logical event.


## React to a limit

The following example assumes `docs_demo_pressure` and `docs_demo_pressure_limit` already exist. Create a free `docs_demo_fuel_valve` demo channel too. The reaction below holds it at zero while pressure is above the limit; it does not connect to hardware.

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

The populated `trigger:` runs once at activation, then synchronously when an input dependency changes. It is never polled. Return numeric `1` to assert the condition; a rising edge fires the event. Staying at `1` does not repeatedly fire it. Zero, another numeric value, no return, or an execution error deasserts it. Lua also accepts numeric strings through conversion, which Native C++ rejects; use numeric returns in shared scripts.

The maintained condition has no five-second timeout. If pressure remains above the limit without another input write, `docs_demo_pressure_abort_firing` stays `1`. A populated trigger implicitly returns `0` when it falls through. An explicit `return null` or bare `return` also clears the condition, but Lua logs a nonnumeric-result error while Native C++ treats it as no numeric result. Use numeric `1` and `0` for clear, portable behavior. Static value reads establish dependencies. Dynamic names need explicit static inputs that cause reevaluation; see [Channel Calculations](Channel%20Calculations.md#dependencies).

The firing reaction runs inline in that channel-update chain. `on_firing:` runs for both transitions, so the example explicitly frees its automatic override when the trigger clears. Freeing authority leaves the last accepted value in place; it does not restore an earlier valve command. `on_event:` follows board presence instead, including silence, so it is not the release condition for this interlock.

An ARGUS event of type `abort` does not stop every task or command hardware by itself. Connect the reaction to your application's control logic and follow the channel's [write authority](../Engine/Commanding%20and%20Control.md). Device response still depends on the driver, transport, and hardware. See [Execution and Timing](../Engine/Execution%20and%20Timing.md).

To try it, start with pressure below the limit, activate the file, then raise pressure above the limit. Inspect the event and the valve channel’s `automatic_override` policy. Lower pressure again and confirm that control is released. Acknowledging the event alone should not release an active override. The [example workspace](../Getting%20Started/Example%20Workspace.md) applies this pattern to simulated equipment.

## Generated channels

For the example above:

| Channel | Meaning |
| --- | --- |
| `docs_demo_pressure_abort_firing` | `1` while the maintained condition is asserted or a one-shot pulse is still within its five-second window. Observe-only. |
| `docs_demo_pressure_abort` | Whether the event is present on the active ARGUS board. Observe-only; silenced events report zero. |
| `docs_demo_pressure_abort_trigger` | Writable pulse input, created because the declaration has a `trigger:` section. An assertion automatically resets this input to zero, including a calculated assertion. It does not display the maintained firing state. |

Use `on_firing:` for a firing reaction and `on_event:` for board-presence reactions. On a state transition, both receive the new generated state as `value`/`new_value` and the previous state as `current_value`. Do not add an explicit return; the engine preserves the generated diagnostic value. Static channel reads in these sections also register calculation dependencies. An extra dependency write reruns the reaction with the existing generated state as all three arguments, without rewriting that state or its timestamp. The reaction can therefore run even when firing or board presence has not changed.

Acknowledging an event does not clear its condition. Resolution is allowed after firing stops. An event triggered again later reopens or refreshes the same keyed event. [ARGUS Events](../Interface/ARGUS%20Events.md) explains the operator controls.

## Trigger a one-shot event

Leave `trigger:` empty when the event should accept external pulses without a maintained sensor condition:

```dcode
event docs_demo_checkpoint:
    title: "Checkpoint reached"
    type: message
    separation_seconds: 5
    trigger:

task_sequence docs_demo_checkpoint_run:
    trigger docs_demo_checkpoint
```

A statement-form `trigger docs_demo_checkpoint`, or writing `1` to `|docs_demo_checkpoint_trigger|`, keeps the generated firing channel at `1` for five seconds after the latest pulse. Each new pulse refreshes that window. The input automatically resets to `0`. Writing `0` directly to the trigger input does not cancel a pulse or clear a maintained condition. Statement-form triggering also works without a `trigger:` section; that section is needed to create the writable pulse input.

If a declaration uses both forms, firing remains `1` while either its maintained condition is asserted or its pulse window is unexpired. Clearing the condition leaves any unexpired pulse active. Expiring a pulse leaves an asserted condition active. `on_firing:` receives `0` when both are inactive; acknowledgement does not change either.

### ARGUS quiet expiry

`separation_seconds` controls the ARGUS occurrence's quiet expiry; it does not set the generated five-second pulse window. Zero disables ARGUS automatic expiry. When the maintained condition clears or the final pulse expires, DCode explicitly stops the ARGUS occurrence even when separation is zero.

Use `separation_seconds: 0` for a maintained condition. A positive interval can expire its ARGUS occurrence even while the generated `_firing` channel remains `1`, because a maintained true condition does not keep submitting reports. For pulses, a positive interval shorter than five seconds can likewise end the ARGUS occurrence before the generated signal clears; a longer interval does not extend that signal. Keep these separate states in mind when inspecting the board and recorded occurrence history.

## Event details and graphs

`title` is required. Declared event types are `message`, `warning`, `error`, and `abort`; omitting `type` selects `message`. `separation_seconds` is optional and defaults to `0`, disabling ARGUS automatic expiry as described above. When supplied, it must be finite and nonnegative. Other optional metadata includes `description`, `resolution`, `system`, `subsystem`, `channels`, and `auto_acknowledge` (a nonnegative integer number of seconds; zero disables automatic acknowledgement). To wait for an operator, call `hold(...)` or a prompt function from executable DCode; an `event` declaration cannot be a hold or prompt.

In a `channels:` line, commas separate series and semicolons start another graph. Add `@1` through `@5` to select a Y axis. For example, `|temperature|@1, >100@1; |pressure|@1, =50@2` draws two graphs with a temperature threshold and a pressure reference line.

Functions such as `message(...)`, `warning(...)`, and `error(...)` require a separation argument after `auto_acknowledge`. Reports with the same node/title/system/subsystem join one logical event even when producer or type differs. Use declarations when you need generated channels and reactions; reporting the same tuple does not grant their authority. Both Lua and Native C++ execution modes support declarations.

These calls use positional arguments. For example, `warning("Pressure high", "Inspect the sensor", [], "", 0, 5)` supplies a five-second quiet interval with default graph, resolution, and acknowledgement settings. Reporting returns a numeric host result, normally `1`, rather than an event ID, and does not wait for operator handling. `error(...)` reports an event rather than raising an execution exception. `abort(...)` does not automatically stop tasks.

## Prompts inside timeline buckets

`promptNumerical`, `promptYesNo`, `promptString`, and `promptOptions` wait for an operator response before continuing the calling bucket. Other buckets and the mission clock keep running. Stopping or resetting the timeline closes pending bucket prompts without executing the statements after them. Closing a prompt without answering fails its waiting bucket. Give simultaneously active prompts distinct titles within the same system/subsystem.

A prompt is not a mission-clock hold. Use the bucket's `hold_at:` checkpoint or the timeline's clock-hold control when later mission times must wait for approval. See [Sequences and Task Lifecycle](Sequences%20and%20Task%20Lifecycle.md#schedule-a-timeline). Outside bucket execution, prompt calls still wait on their invoking execution thread.

`hold(...)` also blocks its invoking thread until release; it has no cooperative bucket wrapper and can stall a timeline tick. `releaseHold(title)` releases all matching active hold requests on the current engine. Quiet expiry and acknowledgement do not answer a prompt or release a hold.
