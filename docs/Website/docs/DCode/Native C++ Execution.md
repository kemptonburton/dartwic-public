---
summary: Compile DCode on the engine, use shared values, and review fixed-channel execution.
updated: 2026-10-22T18:02
created: 2026-09-07T05:26
---

Native C++ compiles a `.dcode` file into a shared library that the engine loads and calls. You still write DCode. Channel authority and CAESAR scheduling remain part of the engine; supported callbacks execute without entering the Lua interpreter.

Native C++ is one part of a predictable repeated path, not a timing certificate. [Deterministic Automation](../Engine/Deterministic%20Automation.md) explains how to choose and measure that path.

Native C++ supports DCode arrays, objects, strings, functions, `.dcode` helper imports, plugin calls, remote TEMPEST calls, and host APIs as well as numeric control logic. Static value pipes use prepared bindings; interpolated names use a name-based host path. [Values and Scope](Values%20and%20Scope.md) describes the shared value rules. Both backends use the [same language reference](Reference/Overview.md).

## Why combine native DCode and fixed channels?

Fixed channels reserve numeric storage and resolve handles before execution. Native C++ compiles the supported DCode logic that reads and writes them. Together they reduce repeated storage and interpreter work in a known control cycle.

Each read or accepted write takes effect at its DCode line. A later error does not roll back earlier writes. Inline calculations and event reactions add to the writer's duration; device I/O and plugin calls have their own costs too. Use [Deterministic Automation](../Engine/Deterministic%20Automation.md) to choose and measure the complete path.

Start with the small example below, then try the [read → control → write cycle](../Engine/Tasks.md#try-a-read-control-write-cycle). Neither example needs hardware.

## Install tools on the engine machine

Compilation happens where the **engine process** runs, including when you activate a script from a remote Interface. Installing tools only on your Interface computer will not help a remote engine.

| Engine platform | Required for a new native artifact |
| --- | --- |
| Windows x64 | CMake **3.23 or newer** on the engine's `PATH`; Visual Studio **2022** or its Build Tools with C++ build tools, a Windows SDK, and **C++ Clang tools for Windows / ClangCL**. The backend explicitly selects `Visual Studio 17 2022`, `x64`, and `ClangCL`. MSVC alone is insufficient. |
| Linux | CMake **3.23 or newer**, Ninja, and a CMake-discoverable C++20 compiler with its standard library and linker. The backend selects Ninja and a Release build. |

The engine also needs a writable instance `cache/<project>/dcode/` directory and permission to load the resulting library. The generated project uses the C++ standard library and an embedded host ABI; it does not require a separate DARTWIC SDK checkout or vcpkg installation. Building the engine itself is a separate workflow.

Check `cmake --version` from the environment that launches the engine. On Linux, also check `ninja --version` and your compiler. Restart the engine after changing its environment. A successful native activation is the definitive check that CMake can find and use the whole toolchain. The current loader expects a Windows DLL or Linux `.so`; it does not define a macOS artifact path.

## Build a small example

Create `native_demo.dcode` in the active project's Scripts resource:

```dcode
task_periodic native_demo 10 normal:
    start:
        ticks = 0

    task elapsed_seconds:
        ticks = ticks + 1
        |demo_native_ticks| = ticks
        |demo_native_twice| = ticks * 2
```

1. Select **DCode · Native C++** in the editor's backend selector.
2. Run the script to save, build, and activate it. Changing the selector alone does not replace the loaded runtime.
3. Follow compiler output in **Project → Builder logs** or the **DARTWIC BUILDER** ARGUS log stream. Wait for activation to succeed; compiler output alone does not establish runtime readiness. The structured [Builder report](../Engine/DARTWIC%20Builder.md#inspect-builder-through-tempest) also records `VERIFY / READY`.
4. Start `native_demo` from Tasks. Its channels should advance at about ten updates per second, with `demo_native_twice` twice the tick count. Stop the task when finished.

Activation registers tasks; starting a task executes it. The editor should show **2 fixed · 0 dynamic** for this example's two static output bindings. These counts describe script references, not every task diagnostic channel in the engine.

The selector persists per file in the project's `scripts/scripts_config.json`. For a project managed as files, merge this entry into that file:

```json
{
  "native_demo.dcode": {
    "execution_mode": "native_cpp",
    "run_on_startup": false
  }
}
```

An absent execution mode defaults to `lua`. Enable **Run on startup** after verifying the script if the engine should activate it during startup; task start configuration remains separate. Follow [DARTWIC Builder](../Engine/DARTWIC%20Builder.md) for startup, reload, and failure diagnostics.

## Language and runtime support

| Construct | Native C++ behavior |
| --- | --- |
| Periodic tasks, state machines, sequences, loops | Compiled callbacks run through CAESAR, including lifecycle sections, state transitions, `once` and `when`. A sequence may use ordinary supported statements. |
| Callbacks | Compiled ordinary functions have independent working variables per invocation. Registered calls use the same named argument validation and result values as Lua. |
| Channel calculations and declared events | Compiled callbacks share RAPID dependency ordering, authority and event handling. A calculation returns a numeric result, or no result for `return null` or fallthrough. See [Channel Calculations](Channel%20Calculations.md) for the different direct-write and dependency effects. |
| Task groups and templates | Task groups order their configured members. YAML templates expand before either backend compiles the result. Arrays and objects in YAML rows expand as DCode collection literals. |
| Values and expressions | Both backends support strings, booleans, numbers, explicit `null`, arrays `[]`, objects `{key: value}`, zero-based indexing, nested collections, functions and arithmetic. `5 / 2` is `2.5`. |
| Collection mutation | Existing array items and object fields can change. Array lengths and object keys remain fixed; `push`, `pop`, and adding keys require Lua. Assigning a new collection is supported, subject to prepared-storage escape checks. |
| File globals | Top-level prelude assignments use one synchronized store per file across its runtime blocks. It resets on activation and uses the host bridge in native callbacks. Runtime-block variables stay private. |
| Plugin and host functions | A plugin call with a validated fixed numeric schema and typed prepared handler uses a retained binding and caller-owned result storage. Other host calls use the native bridge and may allocate, block, publish telemetry or perform I/O. Review their use in control callbacks. |
| Static channel pipes | Static `|channel|` value access uses pre-resolved bindings. A fixed RAPID channel gives the prepared numeric path; static metadata reads call the host API. |
| Dynamic names | Interpolated `|{name}|` references compile in both backends through name-based RAPID host callbacks. They do not use a prepared fixed binding. |
| Imports | Native C++ compiles helper-only `.dcode` modules, including nested imports, into the native artifact. Raw `.lua` imports require the Lua backend. Imported files may not declare runtime blocks or events. |
| Waits and timelines | `wait(seconds)` and `wait_until(condition, time=0, timeout=0)` run in both backends. Sequence holds pause duration and timeout accounting. They block their callback while waiting and belong outside fixed-rate control loops. `task_timeline` still requires Lua. The former statement wait forms and public `sleep` are rejected. |

Static pipe writes inside imported `.dcode` helpers participate in native fixed-output declaration and binding. `tempest_operation` and `tempest_pinned_operation` block the calling DCode callback until the response or timeout. Keep them in sequences or other non-control work.

Native pipe assignments write numeric values; metadata pipe assignments require Lua. Typed host functions such as `upsertChannelReference` use the host bridge instead of a prepared numeric binding. Native `print` takes one expression, `log`/`log_warning`/`log_error` are statements with a literal stream name, and `assert` takes one condition without Lua's optional message or returned values. The generated reference records each function's backend limits.

For collection syntax, truthiness, and variable lifetime, see [Values and Scope](Values%20and%20Scope.md). Use runtime variables for intermediate values. File globals and dynamic channel names use the host bridge; they are not prepared fixed numeric operations.

Keep waits, prompts, and remote operations out of a repeated control callback. They block its thread even when compiled. Use a sequence when waiting is part of the procedure.

## Verify the loaded runtime

Check three things separately:

| Check | Evidence |
| --- | --- |
| Compiled and activated | Successful activation job and Builder `VERIFY / READY`; the loaded script has `execution_mode: "native_cpp"` and matches the saved source. |
| Bound as intended | Editor fixed/dynamic chip and Builder binding details. A successful build may still contain dynamic inputs. |
| Running as intended | Start the task, check output values, actual frequency, execution time, and missed-cycle diagnostics. Test input-to-output behavior under realistic load. |

The engine keeps one shared CMake build directory per project at `<instance-root>/cache/<project-name>/dcode/native_dcode/build/`. Generated C++ for each script is under `src/`, matching its relative script path. The named libraries are under `bin/<script-path>/<script-name>/`, and the latest compiler log for each script is under `logs/`. For example, `other/fill_sim.dcode` produces `src/other/fill_sim.cpp`, `bin/other/fill_sim/fill_sim-<artifact-key>.dll` on Windows (or `.so` on Linux), and `logs/other/fill_sim.log`. The shared build directory contains only the current compiler scratch project, not a separate CMake tree for every script. When a copied or migrated CMake build tree still names its previous directory, the engine recreates that scratch build while preserving the named libraries and logs. The key includes the source/dependency hash, native backend cache version, and host build stamp. This cache stays outside the Git-tracked project. A matching library can be reused without invoking the compiler; a cache hit alone does not verify that the machine can compile a new script. After activation, the engine removes older libraries once their callbacks have unloaded.

During a new build, Builder shows CMake output as it arrives and marks configuration, compilation, and library loading separately. ARGUS stores the same live output in the `DARTWIC BUILDER` stream, and the script's `logs/<script-path>/<script-name>.log` is flushed during compilation so partial output survives an interruption. A loaded library still needs binding resolution and activation; the Builder `VERIFY / READY` event is the final readiness signal. A compilation failure leaves the previous runtime installed. A later failure after runtime replacement begins does not guarantee restoration; inspect the activation result.

For API access, use [get-script-build-report](../Engine/Reference/TEMPEST/Operations/dartwic/get-script-build-report.md) with `{"filePath":"native_demo.dcode"}`. Its payload contains the report directly: `status`, `cache_hit`, `artifact_path`, `log_path`, and `log`. `status: "loaded"` means the library loaded; check the completed activation and loaded-script metadata too, because binding and activation happen afterward.

Native compilation removes Lua interpretation from these callbacks. Fixed bindings reduce channel lookup work; each input is read when its DCode line executes, without a task-wide snapshot. Neither establishes a hardware deadline: operating-system scheduling, locks, driver behavior, and external I/O still matter. [Execution and Timing](../Engine/Execution%20and%20Timing.md) explains those boundaries.

Native and Lua inline calculations are both valid. When a native task reaches either one through a committed channel write, its mutex wait and execution are part of that task's completion interval. Inspect `channel_calculations` in `dartwic/get-registered-tasks` for the calculation mode, active state, invocation count, and recent/max duration; do not assume compilation made a transitive dependency chain bounded.

### Read the execution-path review

After a Native C++ script is active, the DCode editor shows an **execution-path review**, also available in the structured Builder report. It follows each fixed native output through active dependent channel calculations and reports:

- a native binding that is currently dynamic;
- a fixed output that synchronously reaches a Lua calculation, including transitive calculation hops; and
- a reachable calculation containing a `for`, `while`, or `repeat` construct.

These are review signals, not prohibitions or a deadline certificate. A bounded loop and a Lua calculation can be the correct implementation. Calculation timing remains available as the largest observed invocation so far and includes the calculation mutex wait, but DARTWIC does not choose a cost threshold for the application. Compare it with the actual calling task period and test under representative load. The review only sees active DCode calculations and static native bindings, so drivers, direct native allocation, opaque plugin work, and runtime-dependent branches still require their own evidence.
