---
summary: Follow native builds, fixed-channel preparation, binding changes, and activation.
created: 2026-09-07T05:26
updated: 2026-10-26T14:16
---

DARTWIC Builder prepares code and channels for execution in the Engine. It turns Native C++ DCode into a compiled library, connects the code to its channels, and reports whether the new runtime became active. This helps explain why an activation failed or why an edit is not running yet.

A **binding** connects code to a channel it reads or writes. A compiled **artifact** is the library produced from a script. Builder reports both preparation and loading; compilation alone does not establish that the replacement runtime is active.

Native compilation starts when a Native C++ file is activated, manually or at Engine startup. [Native C++ Execution](../../DCode/Native%20C%2B%2B%20Execution.md) covers tools and the first build.

# Build stages

A **session** groups the stages and results of a build or configuration operation. Read structured details through the [Builder report](#builder-api). For compiler output, open **Project → Builder logs** or the **DARTWIC BUILDER** stream in [Logs](../../Interface/Logs.md):

| Stage | What to look for |
| --- | --- |
| `PLAN` | Script, task, trigger, and selected backend. |
| `CHANNELS` | Declared fixed outputs, channels promoted from dynamic storage, and missing reads created as dynamic. |
| `BIND` | Each channel's fixed/dynamic storage and input/output role; affected consumers rebound after a layout change. |
| `COMPILE` | Live CMake/compiler output, configure/compile/load progress, compiler errors, artifact path, duration, or `CACHE_HIT`. |
| `ACTIVATE` | Replaced tasks, released/restored task groups, and previously running tasks restarted. |
| `VERIFY` | `READY` after successful activation, or the failure that prevented it. |

Stages can appear in a different order or be absent when no compilation is needed. A fixed-channel warning can coexist with a successful activation: a dynamic read is allowed, but may be unintended for a control path. Inspect the record's context to find the channel name.

The shared log viewer shows compiler output across builds, labelled by script path. The action row reports activation status, including failures before compiler output exists. Structured records retain compiler lines too.

| Result or location | Meaning |
| --- | --- |
| `LOADED` | The library entered memory. |
| `VERIFY / READY` | Activation succeeded and the new runtime is ready. |
| `CACHE_HIT` | An existing artifact was reused; old compiler lines are not replayed as live progress. |
| Native cache `build/` | The project's shared compiler build directory. |
| Native cache `logs/<script-path>/<script-name>.log` | Script output flushed during compilation. |
| Native cache `bin/` | Named compiled libraries. |

The fixed-configuration API below reports allocated fixed slots and reserved capacity. A protected layout does not prove every task is running or every input is fixed.

# Configuration and binding changes

Configuration prepares the resources code will use. For fixed channels, that means assigning reserved storage and resolving channel bindings before execution. Reconfiguration applies a changed layout through the Engine lifecycle.

Native activation discovers direct channel outputs across configured native files, reconciles them with RAPID, and resolves the current file's references. This allows a consumer to bind to a configured native producer even if the producer file has not yet been activated. Read-only missing channels are created as dynamic with an initial value of zero, accompanied by a warning.

Declared layout changes take an exclusive lifecycle configuration boundary. Running affected tasks stop for reconfiguration, complete their owner cleanup, configure once, and restart only if they were running and configuration succeeds. You do not need to manually unlock fixed configuration to activate DCode or apply a task's declared configuration.

When a task configuration or native producer changes storage, affected loaded native consumers can be rebound without recompiling their source. Builder records that impact. Ordinary value writes keep the existing storage class; they do not perform this configuration work.

# Reload and startup

Reload replaces the code behind existing runtime resources. It must preserve which tasks should resume while giving the new implementation a fresh start state.

During a native rebuild, existing running tasks initially continue on their current artifact and new start requests wait. After the new artifact loads and resolves, activation replaces the affected runtimes and restores tasks that were running. This is a runtime replacement: native task state resets at start, so do not assume counters or controller state survive it unchanged.

A failed build does not automatically switch the file to Lua. Read the failed session and compare the editor's selected backend and source with the loaded runtime. Do not infer that a requested edit is active just because an older task is still running. Channel reconciliation can happen before compilation fails, so a failed build is not a promise that every configuration side effect was rolled back.

At startup, Builder inventories plugin tasks with fixed channels and activates configured native startup scripts, then protects the fixed layout. A failed native startup script produces a failed startup session rather than a successful `READY` result. Startup channel overrides are applied after fixed declaration and before deferred runtimes start; see [Startup values](../Channels%20and%20Control.md#startup-values).

# Build problems

| Symptom | Next step |
| --- | --- |
| CMake configuration fails | Read the Builder output or ARGUS `DARTWIC BUILDER` stream; the script's latest log remains under the project's native cache `logs/`. Check tools in the engine process's environment, especially Windows VS 2022 ClangCL or Linux Ninja. |
| C++ compilation fails | Use the reported `.dcode` line and native diagnostic. Validation catches many unsupported constructs, but compiler/type errors can still arise during activation. |
| Artifact cannot load | Inspect the load/ABI error and artifact path. A compiled file is not necessarily loadable on another machine. |
| Unexpected dynamic binding | Check the producer's configuration and spelling. Declare the channel fixed in its owning plugin task or native producer; merely reading a name does not make it fixed. |
| Multiple direct writers warning | Give the output a clear owner or define task ordering deliberately. Fixed storage alone does not order independent tasks. |
| Fixed capacity exhausted | Increase `rapid_fixed_channel_capacity` in the engine configuration and restart. It defaults to 4096; capacity is allocated when RAPID is constructed. |
| Builder waits for transactions | Inspect the oldest active transaction's owner and age. A long callback, native sleep, or blocking driver work can hold configuration up. Execution-line details are available where the runtime supplies them. |
| Build succeeds but nothing changes | Confirm the requested source/backend is loaded, start the task, and inspect authority, bindings, and task timing. |

# Fixed native channels

Builder prepares fixed channel storage and binds native code to it before execution. [Channels and Control](../Channels%20and%20Control.md#fixed-and-dynamic-channels) explains the storage types. [Deterministic Automation](Deterministic%20Automation.md) explains when preparation helps and how to test the complete cycle.

## Preparation and bindings

Configure mappings before starting and reconfigure when they change. Handles include a generation so an old binding cannot silently address a different channel after its slot is reused. Inspect binding and reconfiguration errors in the Builder report.

## Declare the producer's channels

For [Native C++ DCode](../../DCode/Native%20C%2B%2B%20Execution.md), activation automatically declares direct `|output| = expression` targets, calculation targets, and state-machine current/target channels as fixed. It includes outputs from other configured native files when resolving producer/consumer bindings.

Reading `|input|` does not declare a fixed producer. If no channel exists, native activation creates a dynamic channel with value zero and reports a warning. Configure the acquiring plugin to publish fixed storage, or supply the intended native producer. Do not add a dummy writer merely to suppress a dynamic-binding warning.

For an engine plugin, declare channels during task configuration (`on_configure`), using its SDK pointer:

```cpp
auto pressure = api->createFixedChannel("sensor_pressure", 0.0);
auto temperature = api->createFixedChannel("sensor_temperature", 0.0);
```

This creates or promotes storage and returns a retained local handle. The supplied initial value applies only to a new channel; existing fixed or promoted dynamic state stays intact. Call it during configuration, save the handles in task instance state, then use [queryChannel](../../Plugins/Reference/Engine/Channels/SDK_API-queryChannel.md) and [upsertChannel](../../Plugins/Reference/Engine/Channels/SDK_API-upsertChannel.md) at the executing lines. Ordinary upserts do not claim authority. `TaskRuntime::setFixedInputChannels` retains declared plugin inputs; ordinary DCode reads them when reached.

## Configure and verify the layout

Builder applies declared layout changes through DCode activation or task configuration, without a manual unlock. Direct layout changes outside that lifecycle boundary remain restricted.

Inspect the channel's `storage` value (`fixed` or `dynamic`) and the editor's native binding chip. Builder lists each binding and reports changes that rebind loaded consumers. The engine's `rapid_fixed_channel_capacity` setting defaults to **4096** slots and is read when RAPID is constructed. If capacity is exhausted, increase it and restart; the pool does not grow automatically at runtime.

# Builder API

Send these operations through a [registered TEMPEST connection](Using%20TEMPEST.md):

| Operation | Payload | Result |
| --- | --- | --- |
| `dartwic/builder/get-report` | `{"script_path":"native_demo.dcode","limit":100}` | Matching sessions/events plus fixed configuration, loaded scripts, and active transactions. Omit the filter for the whole project. |
| `dartwic/get-script-build-report` | `{"filePath":"native_demo.dcode"}` | Latest compiler report and artifact/log paths for that file. |
| `rapid/get-fixed-configuration` | `{}` | `sealed`, `state`, `automatic_updates`, fixed slot count, and capacity. |

Script, task, and channel filters match each record's own context. They can omit events whose context only names affected consumers. To retrieve a whole session, take its `id` from `sessions` and make a second request with only `{"session_id":"<returned id>","limit":300}`. Do not keep the script filter on that second request.

The [generated operation reference](../Reference/TEMPEST/Operations/DCode.md) documents request and response fields. Use the compiler report for build output and Builder's final activation event for runtime readiness.
