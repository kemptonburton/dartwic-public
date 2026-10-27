---
summary: Compile DCode on the engine, use shared values, and review fixed-channel execution.
updated: 2026-10-27T05:20
created: 2026-09-07T05:26
---

Native C++ DCode is for repeated acquisition and control work where execution overhead and timing variation matter. You still write DCode; the Engine compiles it into a library instead of interpreting its logic on every cycle.

# Native DCode and fixed channels

The goal is to prepare work before execution, then keep each cycle focused on reading inputs, calculating, and writing outputs. Native execution and fixed channels address different parts of that work:

| Part | Purpose |
| --- | --- |
| Compiled DCode | Reuse compiled logic instead of interpreting the script each iteration. |
| Fixed channels | Reserve numeric channel storage and resolve channel names to reusable handles before execution. |

For a pressure controller, the Engine can prepare its pressure and valve-command bindings before the task runs, then reuse them every iteration. Native DCode uses these fixed bindings for static numeric value pipes.

Together, these reduce recurring execution and channel-access work to support more predictable cycle timing. [Deterministic Automation](../Engine/Advanced/Deterministic%20Automation.md) explains preparing and measuring the complete acquisition-to-output path.

# Native Configuration

Compilation happens on the **Engine computer**, even when you activate from a remote Interface. Install the build tools there:

| Platform | Required tools |
| --- | --- |
| Windows x64 | CMake 3.23+, Visual Studio 2022 or Build Tools with C++ tools, a Windows SDK, and ClangCL. The backend selects `Visual Studio 17 2022`, `x64`, and `ClangCL`. |
| Linux | CMake 3.23+, Ninja, and a CMake-discoverable C++20 compiler, standard library, and linker. The backend uses a Release build. |

The loader supports Windows DLLs and Linux `.so` files. The Engine needs a writable instance `cache/<project>/dcode/` directory and permission to load libraries. No separate SDK checkout or vcpkg installation is needed.

Check `cmake --version` in the environment launching the Engine; on Linux, also check Ninja and the compiler. Restart after environment changes. A successful new compilation verifies the toolchain; loading a cached library does not.

## Backend Selection

Select **DCode · Native C++** in the editor. The choice is saved per file in the project's `scripts/scripts_config.json`. For a project managed as files, merge an entry like this:

```json
{
  "native_demo.dcode": {
    "execution_mode": "native_cpp",
    "run_on_startup": false
  }
}
```

An absent mode defaults to `lua`. Enable **Run on startup** after verifying the script if it should activate at Engine startup; starting its tasks is separate.

# Native Lifecycle

Run saves the file, builds or reuses its library, loads it, and activates its runtime definitions. Changing the backend selector alone does not replace the loaded runtime. Tasks must then be started; other blocks follow their normal [activation rules](Runtime%20Blocks%20and%20Activation.md).

Replacement or removal releases each runtime owner's channel claims after active work and applicable cleanup finish. Channels and stored values remain. See the [channel cleanup rules](../Engine/Channels%20and%20Control.md#stop) for policies and caller-owned authority.

Parsing or compilation failure leaves the old runtime installed. Failure after replacement begins does not guarantee restoration; inspect the activation result.

# Native task example

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

1. Select **DCode · Native C++** and Run.
2. Follow **Project → Builder logs** or the **DARTWIC BUILDER** ARGUS stream. Wait for successful activation and Builder `VERIFY / READY`.
3. Start `native_demo` from Tasks. Its channels should advance about ten times per second, with `demo_native_twice` twice the tick count. Stop when finished.

# Native Execution

Compiled DCode keeps the same channel-write and variable-lifetime rules. Compilation changes how the code executes; it does not give waits, plugin calls, or device I/O independent scheduling.

## Channel Access

The example should show **2 fixed · 0 dynamic** in the editor. These counts describe script references, not every task diagnostic channel.

Reads and accepted writes take effect at their DCode lines, without a task-wide input snapshot or rollback. Synchronous calculations, including downstream Lua calculations, add their execution and mutex wait to the writer's duration. See [Deterministic Automation](../Engine/Advanced/Deterministic%20Automation.md) for measuring the complete path.

## Language and runtime support

Most everyday DCode works in both backends. These features need attention:

| Feature | Native behavior |
| --- | --- |
| Timelines | `task_timeline` requires Lua. |
| Collections | Arrays retain their length and objects their keys; existing items can be replaced. |
| Imports | Use helper-only `.dcode` files; static helper outputs participate in binding. Raw `.lua` helpers require Lua. |
| Pipes | Static numeric values use prepared bindings. Metadata reads, dynamic names, and file globals use the host; metadata pipe writes require Lua. |
| Plugin functions | Supported numeric schemas can use [typed prepared handlers](Modules%20and%20Native%20Functions.md#native-function-execution); other calls use the host bridge. |

Waits, prompts, and remote calls still block their invoking execution path. The [language reference](Reference/Overview.md) records exact backend restrictions; [Values and Scope](Values%20and%20Scope.md) and [Modules and Native Functions](Modules%20and%20Native%20Functions.md) explain shared behavior.

# Runtime Verification

Check compilation, bindings, and runtime behavior separately:

| Check | Evidence |
| --- | --- |
| Activated | Successful activation and Builder `VERIFY / READY`; loaded metadata matches the source and `native_cpp` mode. |
| Bound as intended | Editor fixed/dynamic counts and Builder binding details. A successful build can still include dynamic inputs. |
| Running as intended | Outputs, actual frequency, execution time, and missed cycles under representative load. |

Generated code, libraries, and compiler logs stay in the instance's `cache/<project>/dcode/native_dcode/` directory, outside workspace Git. [DARTWIC Builder](../Engine/Advanced/DARTWIC%20Builder.md) covers build stages, startup, reload, and diagnostics. Its [compiler report](../Engine/Reference/TEMPEST/Operations/dartwic/get-script-build-report.md) supplies artifact and log paths; `loaded` alone does not establish successful activation.

## Execution-path review

The editor and Builder report follow fixed native outputs through active dependent calculations, flagging dynamic bindings, Lua execution, and calculations containing loops.

Use these signals to choose work to measure. Calculation durations include mutex wait; compare them with the task period under load. The review covers active calculations and static bindings, while driver I/O, plugin internals, and runtime-dependent branches need separate measurement. See [Execution and Timing](../Engine/Execution%20and%20Timing.md).

# Reference

- [DCode language reference](Reference/Overview.md) — Syntax, functions, and backend-specific restrictions.
- [Builder report](../Engine/Reference/TEMPEST/Operations/dartwic/get-script-build-report.md) — Structured build status and output.
- [DARTWIC Builder](../Engine/Advanced/DARTWIC%20Builder.md) — Preparation, loading, cache, and activation diagnostics.
- [Execution and Timing](../Engine/Execution%20and%20Timing.md) — Scheduling and complete input-to-output timing.
