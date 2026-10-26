---
summary: Compile DCode on the engine, use shared values, and review fixed-channel execution.
updated: 2026-10-26T14:16
created: 2026-09-07T05:26
---

Native C++ compiles a `.dcode` file into a library the Engine loads and runs. You still write DCode. Use it when compiled callbacks and prepared fixed-channel access help your repeated control path; the Engine still owns scheduling, channel authority, and runtime lifecycle.

Start with Lua while developing the logic. Native compilation removes Lua interpretation from supported callbacks, but the complete path still includes calculations, plugin calls, drivers, and operating-system scheduling.

# Why combine native DCode and fixed channels?

Fixed channels reserve numeric storage and resolve handles before execution. Native DCode uses those bindings for static numeric pipes. This reduces repeated storage and interpreter work in a known cycle.

Reads and accepted writes take effect at their DCode lines. There is no task-wide input snapshot or rollback of earlier writes after a later error. Inline calculations add their execution and mutex wait to the writer's duration. [Deterministic Automation](../Engine/Advanced/Deterministic%20Automation.md) explains how to choose and measure the full path.

# Install tools on the engine machine

Compilation happens on the computer running the **Engine**, including when you activate from a remote Interface.

| Platform | Tools for a new native artifact |
| --- | --- |
| Windows x64 | CMake 3.23+, Visual Studio 2022 or Build Tools with C++ tools, a Windows SDK, and ClangCL. The backend selects `Visual Studio 17 2022`, `x64`, and `ClangCL`. |
| Linux | CMake 3.23+, Ninja, and a CMake-discoverable C++20 compiler with its standard library and linker. The backend uses a Release build. |

The current loader supports Windows DLLs and Linux `.so` files. The Engine needs a writable instance `cache/<project>/dcode/` directory and permission to load libraries. No separate SDK checkout or vcpkg install is required for these generated projects.

Check `cmake --version` in the environment that launches the Engine; on Linux, also check Ninja and the compiler. Restart the Engine after environment changes. A successful **new** native activation checks the complete toolchain; a cached library can load without compiling.

# Build a small example

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
3. Follow compiler output in **Project → Builder logs** or the **DARTWIC BUILDER** ARGUS log stream. Wait for activation to succeed; compiler output alone does not establish runtime readiness. The structured [Builder report](../Engine/Advanced/DARTWIC%20Builder.md#builder-api) also records `VERIFY / READY`.
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

An absent execution mode defaults to `lua`. Enable **Run on startup** after verifying the script if the engine should activate it during startup; task start configuration remains separate. Follow [DARTWIC Builder](../Engine/Advanced/DARTWIC%20Builder.md) for startup, reload, and failure diagnostics.

# Language and runtime support

Most everyday DCode values, functions, helper imports, plugin calls, and channel operations are supported. Keep these differences in mind:

| Feature | What to account for |
| --- | --- |
| Timelines | `task_timeline` requires Lua. |
| Collections | Native arrays retain their length and objects their keys; replacing existing items is supported. |
| Imports | Use helper-only `.dcode` files. Raw `.lua` helpers require Lua. Static helper outputs participate in native binding. |
| Pipes | Static numeric value pipes use prepared bindings. Metadata reads, dynamic names, and file globals use the host; metadata pipe writes require Lua. |
| Host and plugin functions | A supported fixed numeric plugin schema can use a typed prepared handler. Other calls use the host bridge and may allocate, block, or perform I/O. |

Use runtime variables for intermediate state. Waits, prompts, and remote operations still block their invoking execution path, even when compiled; keep them outside repeated control callbacks. The generated language/function reference records exact backend restrictions, including `print`, logging, and assertions. [Values and Scope](Values%20and%20Scope.md) and [Modules and Native Functions](Modules%20and%20Native%20Functions.md) cover the shared patterns.

# Verify the loaded runtime

Check these results separately:

| Check | Evidence |
| --- | --- |
| Compiled and activated | Successful activation and Builder `VERIFY / READY`; loaded metadata matches the saved source and `native_cpp` mode. |
| Bound as intended | The editor's fixed/dynamic chip and Builder binding details. Dynamic inputs can coexist with a successful build. |
| Running as intended | Start the task and inspect outputs, actual frequency, execution time, and missed cycles under representative load. |

Builder logs separate configuration, compilation, loading, and activation. A loaded library is not yet proof of a successfully activated replacement. Parsing or compilation failure leaves the old runtime installed; a failure after replacement begins does not guarantee restoration. Inspect the activation result.

Generated code, libraries, and live compiler logs stay in the instance's `cache/<project>/dcode/native_dcode/` directory. Keep them outside workspace Git. [DARTWIC Builder](../Engine/Advanced/DARTWIC%20Builder.md) owns the build-stage and report workflow. Its structured API accepts `{"filePath":"native_demo.dcode"}`; the payload contains `status`, `cache_hit`, `artifact_path`, `log_path`, and `log`. A `loaded` status still needs the completed activation and loaded-script metadata.

For inline calculation timing, inspect `channel_calculations` in `dartwic/get-registered-tasks`: mode, active state, invocation count, and recent/max duration. A compiled task can still reach Lua calculations through its output dependencies.

## Read the execution-path review

The editor and structured Builder report follow fixed native outputs through active dependent calculations. They flag a currently dynamic binding, a path that reaches Lua, and reachable calculations containing loops.

These signals identify work to review. The largest observed calculation duration includes mutex wait; compare it with the calling task period and test under load. The review sees active DCode calculations and static native bindings. Driver I/O, plugin internals, allocation, and runtime-dependent branches need their own evidence. Neither compilation nor a clear review establishes a hardware deadline.

# Reference

- [DCode language reference](Reference/Overview.md) — Syntax, functions, and backend-specific restrictions.
- [Builder report](../Engine/Reference/TEMPEST/Operations/dartwic/get-script-build-report.md) — Structured build status and output.
- [DARTWIC Builder](../Engine/Advanced/DARTWIC%20Builder.md) — Preparation, loading, cache, and activation diagnostics.
- [Execution and Timing](../Engine/Execution%20and%20Timing.md) — Scheduling and complete input-to-output timing.
