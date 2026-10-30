---
summary: Compile DCode on the engine, use shared values, and review fixed-channel execution.
updated: 2026-10-28T21:11
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

Together, these reduce recurring execution and channel-access work to support more predictable cycle timing. [Execution and Timing](../Engine/Execution%20and%20Timing.md#realtime-and-deterministic-tasks) explains prepared execution, locking, and allocation rules.

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

# Build and Activation

Run saves the file, builds or reuses its library, loads it, and activates its runtime definitions. Changing the backend selector alone does not replace the loaded runtime. Tasks must then be started; other blocks follow their normal [activation rules](Runtime%20Blocks%20and%20Activation.md).

Native execution uses the same [artifact cleanup rules](../Engine/Modules%20and%20Tasks.md#removal-and-replacement) as other Engine work.

Builder is the Engine service that performs this preparation. Follow **Project → Builder logs** or the **DARTWIC BUILDER** stream in [Logs](../Interface/Events%20and%20Logs.md#action-and-builder-logs). A build follows this flow:

```text
Prepare channels and bindings → Compile or reuse cache → Load → Activate → Ready
```

`CACHE_HIT` reuses a compiled library; `LOADED` means it entered memory. Successful activation and `VERIFY / READY` establish runtime readiness. Binding warnings can accompany success, so inspect the named channels too.

During a rebuild, running native tasks initially continue on their current library and new starts wait. Activation replaces the runtimes and restores previously running tasks with fresh per-run state. At Engine startup, configured native scripts activate before deferred tasks start; channel startup overrides apply after fixed declaration.

Parsing or compilation failure leaves the old runtime installed. Failure after replacement begins does not guarantee restoration. Channel preparation can also precede a compiler failure, so a failed build does not promise that all configuration effects were rolled back. A failed native build does not automatically select Lua.

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

Reads and accepted writes take effect at their DCode lines, without a task-wide input snapshot or rollback. Synchronous calculations, including downstream Lua calculations, add their execution and mutex wait to the writer's duration. See [Synchronous Execution](../Engine/Execution%20and%20Timing.md#synchronous-execution) for synchronous work within the prepared path.

## Fixed Native Channels

A **binding** connects a script reference to its channel. Activation declares direct native output targets, calculation targets, and state-machine current/target channels as fixed. It inventories other configured native producers too, so a consumer can bind before its producer file is activated.

Reading a missing channel creates dynamic storage with value zero and a warning. Configure the intended acquiring plugin or native producer; adding a dummy writer hides the problem. [Building a Hardware Driver](../Plugins/Building%20a%20Hardware%20Driver.md#fixed-channels-and-the-repeated-path) covers plugin preparation.

A layout change can stop affected tasks, release their runtime claims, configure once, rebind loaded consumers, and restart tasks that were running if configuration succeeds. You do not manually unlock fixed configuration for normal activation. Rebinding consumers need not recompile their source; ordinary value writes do not change storage class.

Check each channel's `storage` field and the editor's fixed/dynamic binding counts. The Engine reserves **4096** fixed slots by default through `rapid_fixed_channel_capacity`; increasing capacity requires a restart. Retained handles include a generation so a retired binding cannot silently address a reused slot.

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

Generated code, libraries, and compiler logs stay in the instance's `cache/<project>/dcode/native_dcode/` directory, outside workspace Git. Its `build/`, `bin/`, and `logs/` folders hold compiler work, libraries, and per-script output. A cache hit does not replay compiler lines.

## Execution-path review

The editor and Builder report follow fixed native outputs through active dependent calculations, flagging dynamic bindings, Lua execution, and calculations containing loops.

Use these signals to choose work to measure. Calculation durations include mutex wait; compare them with the task period under load. The review covers active calculations and static bindings, while driver I/O, plugin internals, and runtime-dependent branches need separate measurement. See [Execution and Timing](../Engine/Execution%20and%20Timing.md).

# Build Problems

Start with the reported stage and script path. These checks separate a compiler failure from an activated task that has not started or cannot publish:

| Symptom | Check |
| --- | --- |
| CMake configuration or compilation fails | Builder logs, the reported source line, and build tools in the Engine process's environment. |
| Library cannot load | The load/ABI error and artifact path. |
| Unexpected dynamic binding | The channel's spelling and its owning producer's configuration. |
| Multiple direct writers | Channel ownership and intended task ordering. Fixed storage does not order tasks. |
| Fixed capacity exhausted | Increase `rapid_fixed_channel_capacity` and restart. |
| Waiting for transactions | The oldest active transaction's owner and age; blocking callbacks or driver work can delay configuration. |
| Successful build without the expected output | Loaded source/backend, task running state, authority, bindings, and task timing. |

## Builder Reports

For scripted diagnosis, use an already [connected Python client](../Clients/Python%20Client.md):

```python
response = client.operation("dartwic/builder/get-report", {
    "script_path": "native_demo.dcode", "limit": 100,
})
response.raise_for_error()
print(response.payload)
```

The [Builder report](../Engine/Reference/TEMPEST/Operations/dartwic/builder/get-report.md) includes sessions, binding/configuration events, and active transactions. To include related consumer events, query the returned `session_id` without a script filter. The [compiler report](../Engine/Reference/TEMPEST/Operations/dartwic/get-script-build-report.md) supplies a file's latest output and artifact/log paths; [fixed configuration](../Engine/Reference/TEMPEST/Operations/rapid/get-fixed-configuration.md) reports slot use and capacity.

# Reference

- [DCode language reference](Reference/Overview.md) — Syntax, functions, and backend-specific restrictions.
- [Compiler report](../Engine/Reference/TEMPEST/Operations/dartwic/get-script-build-report.md) — Structured compiler status and output.
- [Execution and Timing](../Engine/Execution%20and%20Timing.md) — Scheduling and complete input-to-output timing.
