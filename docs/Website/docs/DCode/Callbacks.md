---
summary: Expose ordinary DCode functions to schematic controls and other callers.
updated: 2026-10-27T03:53
created: 2026-10-04
---

A callback exposes a DCode function to schematic controls and other callers. Use it for an action with arguments, several steps, or a result to return.

# Callback Configuration

Declare callbacks at file scope. Use an ordinary `function` for helpers that need no external registration; imported helper modules cannot declare callbacks.

```dcode
gain = 2

callback scale(value):
    global gain
    adjusted = value * gain
    return adjusted
```

Another executable block in this file can call `scale(10)` and receive `20`. Arguments and results support numbers, strings, booleans, arrays, objects, and null. A callback with no return value returns `null`.

## Templates

Generate callbacks from YAML entries:

```dcode
params = yaml "./valves.yaml#valves"

template(params) callback set_{params.valve}(value):
    command |valves_{params.valve}| = value
    return value
```

Generated callbacks belong to the consuming `.dcode` file. The YAML editor's Run action reactivates its consumers. [Templates and Configuration](Templates%20and%20Configuration.md) covers the setup.

# Callback Lifecycle

Activating the file registers its callbacks without executing their bodies. Reactivation retires the old registrations before installing their replacements; availability can briefly lapse.

Calls already executing keep their captured version and file-global environment until they finish. Removal prevents new calls, invalidates saved captures, and stops independent background work before cleanup completes. See [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md).

The registration owns no channel authority: calls use their caller's authority. Returning or removing a registration does not release the caller's claims or delete channels and stored values. Independent background calls do not inherit task authority and can continue after their caller stops. See the [channel cleanup rules](../Engine/Channels%20and%20Control.md#stop).

# Callback Execution

## Callback scope

Each call has its own arguments and working variables; concurrent calls are not serialized by a callback-wide lock. Use `global` for shared file data, which resets on reactivation. Compound changes to shared globals are not atomic. See [Values and Scope](Values%20and%20Scope.md).

## Synchronous and background calls

Call a registered callback by name, including one declared in another file:

```dcode
result = callDcodeCallback("scale", {value: 10})
```

The named arguments must match the declaration. This returns `20`. Outside a timeline bucket, the call runs synchronously. In a bucket, it suspends only that bucket while other buckets continue; the call retains the bucket's authority and is canceled before the bucket retires.

Use `startDcodeCallback` to continue immediately after the call is accepted:

```dcode
startDcodeCallback("scale", {value: 10})
```

It returns `null`, without a result or execution handle. Invalid names, arguments, or exhausted capacity raise errors at submission. Body errors reach a waiting caller; background errors appear in ARGUS and Engine logs.

## Waits and concurrent calls

A callback can wait between actions. Create the chosen demo channel before trying this simulation example:

```dcode
callback pulse_valve(valve, seconds):
    command |valves_{valve}_open| = 1
    wait(seconds)
    command |valves_{valve}_open| = 0
    free |valves_{valve}_open|
    return {valve: valve, requested_value: 0}
```

The final `free` releases control on normal completion; an error or cancellation may skip it. Channel commands obey authority checks, and a returned command is not equipment feedback. Use a driver or managed task for hardware shutdown that must survive caller failure.

Managed waits and prompts observe cancellation. Blocking plugin/native calls can delay stop; long computations or blocking calls can also stall a timeline's shared thread. See [Timelines](Timelines.md#bucket-execution).

Up to 64 managed calls can be active at once. Submission allocates and starts a worker, so keep it outside real-time control paths. Runtime shutdown cancels and joins managed workers.

# Interface Controls

## Schematic controls

In a button or channel-control card's settings, choose **DCode Callback**, select the callback, and fill its arguments. Text is accepted directly; JSON numbers, booleans, arrays, objects, and null retain their types.

![](_attachments/Pasted%20image%2020261027035302.png)

The Interface shows a pending notification, then the result or error, without freezing during waits. Execution permissions, control enablement, and preview restrictions still apply. Existing Function Call bindings keep their legacy CAESAR route until you select a DCode callback.

## Inspect registered callbacks

Open **Tasks > Callbacks**, after Calculations, to inspect names, arguments, Lua/Native C++ backends, and declaration links. Select a source link to open the declaration. The table updates when the owning script is activated.

![](_attachments/Pasted%20image%2020261027035348.png)

# Reference

- [Callback declaration](Reference/Runtime%20Blocks/runtime-callback.md) — Arguments, scope, and registration.
- [Waiting call](Reference/DCode%20Functions/library-callDcodeCallback.md) — Returned result and error behavior.
- [Background call](Reference/DCode%20Functions/library-startDcodeCallback.md) — Acceptance, capacity, and lifetime.
