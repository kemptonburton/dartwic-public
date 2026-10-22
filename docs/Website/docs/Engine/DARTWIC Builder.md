---
summary: Follow native builds, fixed-channel configuration, binding changes, and runtime activation.
updated: 2026-10-20T15:38
created: 2026-09-07T05:26
---

DARTWIC Builder records the engine's work to configure fixed channels, compile native DCode, bind channel references, and activate runtimes. Open **Project → Builder logs**, or select the **DARTWIC BUILDER** stream in [Logs](../Interface/Logs.md), to follow compiler output.

Builder is part of the engine. Opening its logs does not compile a project. Native compilation starts when you activate a file configured for Native C++ or when that file is activated at engine startup. [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md) covers tool installation and a first build.

Project activation steps embed the same ARGUS log viewer. Search, severity filters, live following, and recorded history work as in Logs. These panes show the current engine's Builder stream across builds; they are not restricted to the selected action's build session. Compiler lines include their script path. The action row reports activation status, including failures that occur before compilation produces output.

## Read a build session

For structured session stages and binding details, query the [Builder report](#inspect-builder-through-tempest). These details remain available through the engine API rather than a separate Interface Builder view:

| Stage | What to look for |
| --- | --- |
| `PLAN` | Script, task, trigger, and selected backend. |
| `CHANNELS` | Declared fixed outputs, channels promoted from dynamic storage, and missing reads created as dynamic. |
| `BIND` | Each channel's fixed/dynamic storage and input/output role; affected consumers rebound after a layout change. |
| `COMPILE` | Live CMake/compiler output, configure/compile/load progress, compiler errors, artifact path, duration, or `CACHE_HIT`. |
| `ACTIVATE` | Replaced tasks, released/restored task groups, and previously running tasks restarted. |
| `VERIFY` | `READY` after successful activation, or the failure that prevented it. |

Stages can appear in a different order or be absent when no compilation is needed. A fixed-channel warning can coexist with a successful activation: a dynamic read is allowed, but may be unintended for a control path. Inspect the record's context to find the channel name.

Native compiler lines arrive in the ARGUS `DARTWIC BUILDER` log stream with the script path. Structured Builder records also retain those lines. Each project's native cache has one shared `build/` directory; its `logs/<script-path>/<script-name>.log` is flushed during compilation, and its named library lives under `bin/`. In the structured report, `LOADED` means the library entered memory; wait for `VERIFY / READY` before treating the new runtime as active. A cache hit reports that the existing artifact was reused and does not replay old compiler lines as live progress. Compiler output alone does not establish successful activation.

The fixed-configuration API below reports allocated fixed slots and reserved capacity. A protected layout does not prove every task is running or every input is fixed.

## What happens during configuration

Native activation discovers direct channel outputs across configured native files, reconciles them with RAPID, and resolves the current file's references. This allows a consumer to bind to a configured native producer even if the producer file has not yet been activated. Read-only missing channels are created as dynamic with an initial value of zero, accompanied by a warning.

Declared layout changes take an exclusive lifecycle configuration boundary. Running affected tasks stop for reconfiguration, complete their owner cleanup, configure once, and restart only if they were running and configuration succeeds. You do not need to manually unlock fixed configuration to activate DCode or apply a task's declared configuration.

When a task configuration or native producer changes storage, affected loaded native consumers can be rebound without recompiling their source. Builder records that impact. Ordinary value writes keep the existing storage class; they do not perform this configuration work.

## Reload and startup

During a native rebuild, existing running tasks initially continue on their current artifact and new start requests wait. After the new artifact loads and resolves, activation replaces the affected runtimes and restores tasks that were running. This is a runtime replacement: native task state resets at start, so do not assume counters or controller state survive it unchanged.

A failed build does not automatically switch the file to Lua. Read the failed session and compare the editor's selected backend and source with the loaded runtime. Do not infer that a requested edit is active just because an older task is still running. Channel reconciliation can happen before compilation fails, so a failed build is not a promise that every configuration side effect was rolled back.

At startup, Builder inventories plugin tasks with fixed channels and activates configured native startup scripts, then protects the fixed layout. A failed native startup script produces a failed startup session rather than a successful `READY` result. Startup channel overrides are applied after fixed declaration and before deferred runtimes start; see [Startup values](Channels.md#startup-values).

## Resolve common problems

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

## Inspect Builder through TEMPEST

Send these operations through a [registered TEMPEST connection](Using%20TEMPEST.md):

| Operation | Payload | Result |
| --- | --- | --- |
| `dartwic/builder/get-report` | `{"script_path":"native_demo.dcode","limit":100}` | Matching sessions/events plus fixed configuration, loaded scripts, and active transactions. Omit the filter for the whole project. |
| `dartwic/get-script-build-report` | `{"filePath":"native_demo.dcode"}` | Latest compiler report and artifact/log paths for that file. |
| `rapid/get-fixed-configuration` | `{}` | `sealed`, `state`, `automatic_updates`, fixed slot count, and capacity. |

Script, task, and channel filters match each record's own context. They can omit events whose context only names affected consumers. To retrieve a whole session, take its `id` from `sessions` and make a second request with only `{"session_id":"<returned id>","limit":300}`. Do not keep the script filter on that second request.

The [generated operation reference](Reference/TEMPEST/Operations/DCode.md) documents request and response fields. Use the compiler report for build output and Builder's final activation event for runtime readiness.
