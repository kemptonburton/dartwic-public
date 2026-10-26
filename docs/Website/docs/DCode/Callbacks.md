---
summary: Expose ordinary DCode functions to schematic controls and other callers.
updated: 2026-10-26T14:16
created: 2026-10-04
---

A callback exposes a DCode function to schematic controls and other callers. Use it for an action with arguments, several steps, or a result to return. Save and activate its file to register it; registration does not execute its body.

# Declare and call a callback

```dcode
gain = 2

callback scale(value):
    global gain
    adjusted = value * gain
    return adjusted
```

Another executable block in that file can call `scale(10)` and receive `20`. To invoke an active callback by name, including one declared in another file:

```dcode
result = callDcodeCallback("scale", {value: 10})
```

The named argument object must match the declaration. Missing or unknown argument names fail before execution. Arguments and results can contain numbers, strings, booleans, arrays, objects, and null. A callback that reaches the end without returning a value returns `null`.

# Wait for a result or start in the background

`callDcodeCallback(name, arguments)` waits for the returned value. In a timeline bucket, that wait yields the bucket: the countdown and other buckets continue. Outside a timeline bucket, the call runs synchronously on the caller's execution path.

Use `startDcodeCallback` when the caller should continue immediately:

```dcode
startDcodeCallback("scale", {value: 10})
```

It returns `null` after the engine accepts the call. It does not return an execution handle or the callback's result. A missing callback, missing/unknown arguments, or exhausted capacity raises an error immediately at the calling line. For a waiting call, a body error also reaches that line. For a background call, a later body error appears in ARGUS and the engine logs.

Background calls continue independently after their caller stops and do not inherit its task authority. Waiting calls from timeline buckets retain that bucket's command context and are canceled before it retires.

Managed waits and prompts observe cancellation. Arbitrary blocking plugin/native code can delay stop unless it supports cancellation itself. Runtime shutdown cancels and joins managed workers. At most 64 managed calls can be active at once; submission allocates and starts a worker, so keep it outside real-time control paths.

# Scope works like a function

Arguments and working variables belong to each call. Use `global` to access outer file data; those shared globals reset on reactivation. Concurrent calls have independent working variables, but compound changes to shared globals are not atomic. [Values and Scope](Values%20and%20Scope.md) owns those rules.

Use ordinary `function` declarations for helpers that need no external registration. Callbacks support the selected backend's normal imports, expressions, collections, channels, waits, and return values. Imported helper modules cannot declare callbacks.

# Inspect registered callbacks

Open **Tasks > Callbacks**, after Calculations, to inspect active callback names, argument names, Lua/Native C++ backends, and declaration links. Select a source link to open the declaration. Save and activate the owning script to replace a registration; the table follows runtime inventory changes.

# Use a schematic control

In a button or channel-control card's settings, choose **DCode Callback**. Select the callback and fill its argument fields. Text is accepted directly; JSON numbers, booleans, arrays, objects, and null retain their types.

The interface shows a pending notification while the callback runs, followed by its returned result or an error. The engine tracks the call as a job, so a wait does not freeze the interface. Execution permissions, schematic control enablement, and preview restrictions still apply.

Existing saved Function Call bindings retain their legacy CAESAR route until you select a DCode callback to replace them.

# Waits and concurrent calls

```dcode
callback pulse_valve(valve, seconds):
    command |valves_{valve}_open| = 1
    wait(seconds)
    command |valves_{valve}_open| = 0
    free |valves_{valve}_open|
    return {valve: valve, requested_value: 0}
```

This is a simulation example, not a hardware pulse timer. Create the chosen demo channel before calling it. The final `free` releases control on normal completion; a failed or interrupted call may not reach it. Put hardware shutdown behavior in a driver or managed task when it must survive a caller failure.

Waiting calls execute with separate call frames; there is no callback-wide lock serializing every caller. Channel commands still obey authority, and a returned requested value is separate from equipment feedback.

A waiting call delays its caller. In a timeline bucket it yields that bucket, but ordinary Lua code and synchronous host/plugin calls still share the tick thread and can stall the timeline. [Scheduling Timelines](Scheduling%20Timelines.md#inspect-timing-and-recovery) explains the clock behavior.

# Reactivation and templates

Reactivation replaces the callback registration. Calls already accepted finish using their captured version and file-global environment; subsequent calls use the rebuilt version. Removing a declaration and reactivating prevents new calls without interrupting outstanding calls.

Callbacks can be generated from YAML templates:

```dcode
params = yaml "./valves.yaml#valves"

template(params) callback set_{params.valve}(value):
    command |valves_{params.valve}| = value
    return value
```

The generated callbacks belong to the consuming `.dcode` file. The YAML editor's Run action reactivates its consumers, updating their callback registrations. See [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) for ownership, stale source, retained channels, and activation failures.

# Reference

- [Callback declaration](Reference/Runtime%20Blocks/runtime-callback.md) — Arguments, scope, and registration.
- [Waiting call](Reference/DCode%20Functions/library-callDcodeCallback.md) — Returned result and error behavior.
- [Background call](Reference/DCode%20Functions/library-startDcodeCallback.md) — Acceptance, capacity, and lifetime.
