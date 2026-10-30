---
summary: Understand module instances, task structures and types, other CAESAR artifacts, and their shared lifecycle.
created: 2026-09-04T17:13
updated: 2026-10-28T22:07
---

A **module** gives the Engine a device connection or shared service. A **task** does work, such as reading that device, calculating a command, or running a procedure.

![](_attachments/Pasted%20image%2020261027193749.png)

For example, one Modbus module connects to a controller. Its read task publishes measurements to channels, while its write task sends channel commands to the device. Several tasks can use the same module without each opening its own connection.

# Modules

A module provides the connection or shared service its tasks use. Its configuration selects the implementation and device settings.

![](_attachments/Pasted%20image%2020261027193841.png)

## Module Types and Instances

A plugin supplies a **module type**; you configure an **instance** for a particular device or service. For example, two Modbus controllers can use the same module type with separate addresses and connections.

Follow [Interface Modules and Tasks](../Interface/Modules%20and%20Tasks.md#configure-a-module) to configure a module. [Building a Hardware Driver](../Plugins/Building%20a%20Hardware%20Driver.md) covers implementing one.

## Module Configuration

Module resources are saved under the project's `modules/` folder. Their identity and type select which plugin implementation to create; `parameters` holds the settings that implementation expects. For a TCP device, those might be its address, port, and timeout. They belong to the shared connection rather than each read/write task.

The driver defines its parameter names and defaults. Keep machine-private credentials in [instance storage](Configuration%20and%20Storage.md#instance-data). The [driver configuration example](../Plugins/Building%20a%20Hardware%20Driver.md#configs) shows how module parameters and task arguments fit together.

## Shared Connections

A read task and write task can both refer to the same module, such as `bench_io`. The module owns their shared device connection; each task supplies its own channel mappings and work. Changing that connection can affect both tasks.

The driver chooses tasks, loops, or its own workers to use that connection; a module does not prescribe one thread per device. Threads created inside a plugin remain the plugin's responsibility to stop and join, which is why registering Task Types and CAESAR artifacts such as Loops are recommended.

# CAESAR

**CAESAR** is the Engine subsystem that runs tasks and other executable artifacts, most on threads. Modules provide connections and services; CAESAR manages the work that uses them.

A **thread** is a path of execution scheduled by the operating system. Work on one thread runs in order; separate threads can progress independently while sharing CPU time.

## Tasks

Tasks perform acquisition, control, or procedure work. The Engine manages when they run and how they start, pause, and stop.

![](_attachments/Pasted%20image%2020261027193816.png)

### Task Types and Instances

Plugins register **task types**: implementations you can select and configure without writing their code. A hardware driver commonly provides a read type to publish measurements to channels and a write type to send channel commands to equipment.

Choose a type, link its module where needed, and set its arguments. Plugins can supply work beyond hardware communication too. [Engine Plugin → Tasks](../Plugins/Engine%20Plugin.md#tasks) explains registration.

The type is reusable code; each named **task instance** has its own arguments and runtime state. For example, `tank_a_read` and `tank_b_read` can use the same read type with different modules and channel mappings.

### DCode Tasks

DCode tasks contain automation you write in a script: feedback logic, equipment coordination, or an ordered test procedure. Activating the script registers its task declarations with the Engine; starting a task begins its run.

A DCode task can then read those measurements and decide when to open a valve. It writes the valve-command channel; the plugin's write task sends that command to the hardware. Plugin tasks handle the device communication, while DCode supplies the automation around it.

![](_attachments/Pasted%20image%2020261027194724.png)

[DCode Tasks](../DCode/Tasks.md) provides declaration syntax and examples for periodic tasks, state machines, and sequences.

## Task Structures

A task's **structure** determines when the Engine invokes its work and what finishes a run. Structure is separate from implementation: a pressure reader and a valve controller can both be periodic tasks.

Periodic, state-machine, and sequence tasks can be implemented in C++ plugins or declared in DCode. [Native C++ execution](../DCode/Native%20C%2B%2B%20Execution.md) compiles DCode; the C++ plugin examples use the public SDK.

Examples use demo signals. Put C++ registrations in the [example plugin's](../Plugins/Overview.md#example-plugin) `onPluginLoaded()`, using its `dartwic` pointer and `using namespace DARTWIC::API;` to create your own Task Types and use DARTWIC functions inside them.

Use DCode Lua for the DCode examples: activate the file, then start its tasks. 

### Periodic Tasks

A periodic task performs one iteration each time it is scheduled. For example, a 50 Hz pressure controller reads measurements and updates its valve command every nominal 20 ms. The body returns after each iteration, while task state remains available for the next one. A slow iteration can delay or skip later releases; the frequency is a scheduling target.

A standalone periodic task has its own CAESAR worker thread. In a [task group](#task-groups), its iterations run on the shared coordinator instead.

**C++:** configure `example_device_plugin.elapsed` as `docs_demo_periodic`.

```cpp
TaskTypeDefinition elapsed;
elapsed.metadata.structure = TaskStructure::Periodic;
elapsed.metadata.default_arguments = {{"frequency_hz", 2.0}};
elapsed.on_task = [api = dartwic](const TaskTypeDefinition&,
                                TaskRuntime& task, double seconds) {
    api->setChannel(task.getTaskName() + "_elapsed", seconds);
};
dartwic->registerTaskType("elapsed", "Elapsed time", elapsed);
```

**DCode:** `task:` runs each iteration. [Syntax and options](../DCode/Tasks.md#periodic-tasks).

```dcode
task_periodic docs_demo_periodic 2:
    task elapsed_seconds:
        set |docs_demo_periodic_elapsed| = elapsed_seconds
```

Both publish elapsed run time about twice per second.

### Worker Tasks

A worker runs long-lived work whose own loop decides when the next operation happens. Use it for a device stream that produces data at its own pace. The Engine calls the body once per start; returning completes the run, rather than scheduling another iteration.

**C++:** configure `example_device_plugin.counter_worker` as `docs_demo_worker`. This simulates an input stream.

```cpp
TaskTypeDefinition worker;
worker.metadata.structure = TaskStructure::Worker;
worker.on_task = [api = dartwic](const TaskTypeDefinition&,
                               TaskRuntime& task, double) {
    double count = 0;
    while (!task.isStopRequested()) {
        api->setChannel(task.getTaskName() + "_count", ++count);
        task.recordWorkerCycle();
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
    }
};
dartwic->registerTaskType("counter_worker", "Counter worker", worker);
```

DCode has no worker declaration. Configured workers use the shared [task controls](#task-channels).

Inspect `docs_demo_worker_count` and `docs_demo_worker_worker_rate`. Writing 0 to its `_running` channel requests stop; this C++ body checks between its short sleeps.

### State-machine Tasks

A state machine is like a periodic task, but it organizes behavior into named stages, such as idle, filling, and venting. Its scheduled body performs the current state's work each iteration. It stays in that state until transition logic accepts a change; entering a state does not mean its work runs only once.

A standalone state machine uses one CAESAR worker thread for all its states. A transition changes which state logic runs; it does not create a new thread. 

**C++:** configure `example_device_plugin.two_stage` as `docs_demo_state`. The implementation owns state storage, dispatch, and transitions.

```cpp
enum class Stage { idle, active };
TaskTypeDefinition machine;
machine.metadata.structure = TaskStructure::StateMachine;
machine.metadata.default_arguments = {{"frequency_hz", 2.0}};
machine.on_start = [](const TaskTypeDefinition&, TaskRuntime& task) {
    task.setTypedRuntimeContext("stage", std::make_shared<Stage>(Stage::idle));
};
machine.on_task = [api = dartwic](const TaskTypeDefinition&,
                                TaskRuntime& task, double) {
    auto stage = task.getTypedRuntimeContext<Stage>("stage");
    api->setChannel(task.getTaskName() + "_active",
                    *stage == Stage::active ? 1.0 : 0.0);
    if (*stage == Stage::idle) *stage = Stage::active;
};
dartwic->registerTaskType("two_stage", "Two-stage demo", machine);
```

**DCode:** declarations supply state dispatch; `transition` changes state. Use `once:` for entry-only work. [State syntax and requests](../DCode/Tasks.md#state-machine-tasks).

```dcode
task_state_machine docs_demo_state 2:
    states:
        idle
        active

    state idle:
        set |docs_demo_state_active| = 0
        transition active

    state active:
        set |docs_demo_state_active| = 1
```

Start the task. Both implementations publish 0 in idle, then 1 on the next iteration in active. A new start begins in idle again.

### Sequence Tasks

A sequence performs an ordered procedure once per start: open a valve, wait for pressure feedback, then continue. Its progress is the position reached in that procedure. Finishing the body completes the run; starting again begins a new execution. 

A standalone sequence runs on its own CAESAR worker thread. Managed DCode waits respond to hold/stop while blocking that execution path.

For C++ registration and callback setup, use [Engine Plugin → Tasks](../Plugins/Engine%20Plugin.md#tasks). [TaskTypeDefinition](../Plugins/Reference/Engine/Tasks%20and%20Loops/TaskTypeDefinition.md) lists the callbacks; [TaskRuntime](../Plugins/Reference/Engine/Tasks%20and%20Loops/TaskRuntime.md) covers retained state and stop/worker APIs.

**C++:** configure `example_device_plugin.two_steps` as `docs_demo_sequence`. Check stop after the ordinary C++ sleep.

```cpp
TaskTypeDefinition sequence;
sequence.metadata.structure = TaskStructure::Sequence;
sequence.on_task = [api = dartwic](const TaskTypeDefinition&,
                                 TaskRuntime& task, double) {
    api->setChannel(task.getTaskName() + "_step", 1.0);
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    if (task.isStopRequested()) return;
    api->setChannel(task.getTaskName() + "_step", 2.0);
};
dartwic->registerTaskType("two_steps", "Two steps", sequence);
```

**DCode:** managed `wait` / `wait_until` observe hold/stop. [Sequence syntax](../DCode/Tasks.md#sequence-tasks).

```dcode
task_sequence docs_demo_sequence:
    set |docs_demo_sequence_step| = 1
    wait(0.1)
    set |docs_demo_sequence_step| = 2
```

On a normal run, the step becomes 1, then 2 after the wait, and the task completes. Stopping during the wait skips the second write.

## Task Groups

A task group puts related scheduled work in an order, such as **read measurements → calculate control → send outputs**. It can coordinate existing plugin tasks and DCode work. All of  the t asks in the group run on **one shared coordinator thread**, finishing one callback before beginning the next.

| Running setup | Threads executing the CAESAR work |
| --- | --- |
| Three standalone tasks | Three independent task threads, without a guaranteed order between them. |
| Three tasks in one group | One group thread executes their callbacks. The members' independent workers are stopped while the group owns execution. |
| Two groups of three tasks | Two coordinator threads, one per group. Each group orders its own members. |

Members retain their names, state, authority, frequencies, and diagnostics. Slower members run only when due; the coordinator derives its schedule from member rates and uses the highest requested member priority. Releasing the group restores independent execution for its running members.

A slow or blocking member delays later members, and a failed read does not automatically prevent a later write. For a 500 Hz group, the whole read → control → write cycle must fit its 2 ms timing requirements; a single 3 ms device call already exceeds that interval.

[Execution and Timing](Execution%20and%20Timing.md#task-groups) explains scheduling and failure handling; [DCode task groups](../DCode/Tasks.md#task-groups) shows the declaration.

Activate these two tasks and their group, then start both tasks. A group can also name already configured plugin tasks.

```dcode
task_periodic docs_demo_reader 10:
    task:
        set |docs_demo_sample| = 42

task_periodic docs_demo_control 10:
    task:
        set |docs_demo_group_result| = |docs_demo_sample| * 2

task_group docs_demo_cycle:
    run: docs_demo_reader
    run: docs_demo_control
```

The reader runs before the controller on one coordinator; the result should be 84.

## Task Configuration

A task configuration identifies its name, registered type, and arguments. Arguments describe one use of that implementation: a module to use, device/channel mappings, and scheduling options. A DCode declaration creates this setup from its header and body.

| Setting | Purpose and scope |
| --- | --- |
| Task name and type | The name identifies this instance and prefixes its channels. A plugin supplies the registered type; DCode supplies its declaration. |
| `frequency_hz` | Requested iterations per second for scheduled work. At 50 Hz, the nominal period is 20 ms. Workers manage their own repetitions; sequence steps are paced by their code and waits. |
| `priority` | `background`, `normal`, `high`, or `critical`. Defaults to `normal`; requests OS scheduling priority without guaranteeing deadlines. |
| `disable_warnings` | Suppresses automatic timing warnings. It does not disable counters, callback errors, or task-health measurements. |
| `health_completion_deadline_ms` | Sets an explicit callback-completion deadline for health reporting. Scheduled tasks otherwise use one period. It reports overdue work rather than forcibly terminating it. |
| Implementation arguments | Module selection, mappings, timeouts, and other options defined by the task type. These differ between drivers. |

**Plugin tasks:** common scheduling options can be supplied in task `arguments`; types can provide defaults. A common driver argument is `module_instance_name`, but the type defines its accepted arguments. See the [task creation fields](Reference/TEMPEST/Operations/dartwic/create-task.md) and [driver configs](../Plugins/Building%20a%20Hardware%20Driver.md#configs).

**DCode tasks:** frequency, priority, and `disable_warnings` appear after the task name. [DCode Task Configuration](../DCode/Tasks.md#task-configuration) gives the header syntax. Loop configuration is described under [Loops](#loops).

Changing a target frequency changes future scheduling. Reconfiguration preserves an existing valid target, including operator adjustments. Use [Interface task controls](../Interface/Modules%20and%20Tasks.md#task-controls) for editing and operating a configured task.

## Task Channels

Tasks expose channels so the Interface, DCode, and clients can use the same controls and inspect progress. Prefix the suffixes below with the task's name: `pressure_reader_running`, for example. Availability depends on the structure and implementation.

### Control Channels

| Suffix | Meaning | Applies to |
| --- | --- | --- |
| `_running` | Write 1 to request start, or 0 to request stop. | Tasks. |
| `_hold` | Write 1 to request hold, or 0 to resume. | Supported task execution; blocking application code must still cooperate. |
| `_target_frequency` | Requested Hz; writable while configured. | Periodic, state-machine, and timeline tasks. |
| `_target_state` | Requested state; the state-machine logic decides whether to accept it. | [DCode state machines](../DCode/Tasks.md#state-requests). |
| `_clock_hold` | Holds mission time while active buckets may continue working. | [DCode timelines](../DCode/Timelines.md#clock-and-task-holds); separate from task hold. |

Control writes **request** a transition. A successful write to `_running` does not prove start or stop handling has finished. Inspect execution status and task health as well as the control value.

### Diagnostic Channels

| Suffix | What it tells you | Applies to |
| --- | --- | --- |
| `_actual_frequency` | Observed iteration rate, which may differ from the target. | Periodic, state-machine, and timeline tasks. |
| `_execution_time` | Smoothed iteration duration in milliseconds. | Periodic, state-machine, and timeline tasks. |
| `_missed_cycles` | Planned releases skipped because execution fell behind. | Periodic, state-machine, and timeline tasks. |
| `_failed_cycles` | Caught execution-body failures; excludes start/end errors. | Tasks. |
| `_worker_rate` | Logical worker iterations per second, reported through `recordWorkerCycle()`. | C++ worker tasks. |
| `_current_state` | The state actually selected, rather than merely requested. | [DCode state machines](../DCode/Tasks.md#state-requests). |
| `_current_line` | Active sequence source line; zero after completion. | [DCode sequences](../DCode/Tasks.md#sequence-tasks). |

The Interface reads these alongside richer runtime status. [Diagnostics](Diagnostics%20and%20Troubleshooting.md#task-health-and-failures) explains active/overdue callbacks, persistent failure counts, and health reports.

## Other Artifacts

These artifacts run on different triggers: loop iterations, timeline times, callback calls, or channel writes.

### Loops

A loop repeats a short callback at a requested frequency without creating a configured task instance for each use. Use it for background work such as discovery, connection monitoring, or publishing a heartbeat.

**C++ plugins** use [`registerLoop`](../Plugins/Reference/Engine/Tasks%20and%20Loops/SDK_API-registerLoop.md) with a [`PluginLoopDefinition`](../Plugins/Reference/Engine/Tasks%20and%20Loops/PluginLoopDefinition.md): `on_loop`, optional `on_start` / `on_end`, and optional `target_frequency_hz`. Prepare captured state first; registration can start execution immediately or defer it until Engine preparation finishes. Engine shutdown runs applicable end handling and authority cleanup.

**DCode** uses `loop <name> <frequency>:` with optional `disable_warnings`. Activation starts it; variables persist until reactivation. Use `once:` for initialization because loops have no `start:` section.

Inspect both in **Tasks → Loops** or through the [runtime-loop query](Reference/TEMPEST/Operations/dartwic/get-runtime-loops.md). DCode loops also expose frequency/timing channels.

Use a task for configured instances and operator run controls. The [C++ loop guide](../Plugins/Engine%20Plugin.md#plugin-loops) and [DCode Loops](../DCode/Loops.md) cover implementation and syntax.

**C++:** publish a heartbeat once per second.

```cpp
dartwic->registerLoop("heartbeat", "Demo heartbeat", {
    .on_loop = [api = dartwic]() {
        api->setChannel("docs_demo_heartbeat", 1.0);
    },
    .target_frequency_hz = 1.0,
});
```

**DCode:**

```dcode
loop docs_demo_heartbeat_loop 1:
    set |docs_demo_heartbeat| = 1
```

Both keep the value at 1 while refreshing its timestamp each iteration. This reports loop activity, rather than proving device health.

### Timelines

A timeline is a specialized task that schedules buckets before and after a reference time, T0. It suits procedures such as a countdown where filling can remain in progress while other scheduled checks occur. Multiple buckets can be active, but they share one thread: managed waits yield their bucket; blocking functions delay all buckets.

Timelines are only available in **Lua DCode**, declare with `task_timeline`, `at` buckets, and `hold_at` checkpoints.

[Timelines](../DCode/Timelines.md) explains clock controls, waits, prompts, recovery, and syntax. Completing a bucket is separate from completing the timeline; authority belongs to the timeline until its run stops.

Activate and start this timeline:

```dcode
task_timeline docs_demo_timeline:
    clock_start: T-1s

    at T-1s:
        execute:
            set |docs_demo_countdown_step| = 1

    at T+0s:
        execute:
            set |docs_demo_countdown_step| = 2
```

Starting publishes step 1 at T-1s, then step 2 at T0. The timeline completes after both buckets finish.

### Callbacks

A callback is a named action with arguments and an optional result, such as a schematic button requesting a valve pulse. Registration makes it available; calling it executes the body.

Direct calls, including `callDcodeCallback` outside timeline buckets, run synchronously on the caller's thread. `startDcodeCallback` returns after submitting work to a managed worker. Supported timeline calls yield their bucket while awaiting the result.

Declare callbacks in **DCode**, using either Lua or Native C++ execution.

[Callbacks](../DCode/Callbacks.md) covers declarations, calls, background execution, and schematic controls. Calls use their caller's channel authority; the callback registration owns no claims to release.

Activate this callback, then select it in a schematic control or call it by name.

```dcode
callback docs_demo_double(value):
    return value * 2
```

`callDcodeCallback("docs_demo_double", {value: 3})` returns 6.

### Channel Calculations

A calculation derives an output from input channels, such as converting sensor current to pressure.

It runs **synchronously on the writer's thread** during relevant channel writes. Its calculations, reactions, and any waits add to the writer's execution time. Calculations have no frequency or start/stop run.

Declare the target and dependencies with `channel_calculation` in **DCode**, using Lua or Native C++ execution.

Returning leaves the calculation installed. [Channel Calculations](../DCode/Channel%20Calculations.md) covers dependencies, state, errors, and syntax. Removal follows the shared [cleanup rules](#removal-and-replacement).

Create `docs_demo_current_ma` and activate this conversion from 4–20 mA to 0–160 pressure units:

```dcode
channel_calculation docs_demo_pressure:
    return (|docs_demo_current_ma| - 4) * 10
```

Write 12 to the input: the output becomes 80. The pipe read establishes the dependency, so later input writes run the conversion synchronously.

### Event Handlers

Events report conditions or occurrences for operators to follow. DCode triggers and write-triggered reactions run synchronously on the input writer's thread, so slow handlers delay that caller. ARGUS maintains the operator-visible event state and history.

DCode uses `event`, `trigger:`, and reaction handlers to maintain conditions such as excessive pressure.

[DCode Events](../DCode/Events.md) covers declarations and reactions. For ARGUS reports from plugins and clients, see [Events and Logs](Events%20and%20Logs.md#firing-events). Clearing or acknowledging an event does not itself release its automation's channel claims.

Create `docs_demo_pressure` first, then activate this maintained condition:

```dcode
event docs_demo_pressure_high:
    title: "Demo pressure high"
    type: warning
    trigger:
        if |docs_demo_pressure| > 80:
            return 1
        return 0
```

The trigger evaluates on activation and input writes: raise pressure above 80 to fire the event, then lower it to clear the condition.

## Lifecycle

Registration, a task run, and artifact removal are separate stages.

### Configuration and Registration

Configuration prepares resources; registration makes work available. Plugins use `on_configure` for configuration and `on_start` for each run. DCode uses `start:` for per-run setup.

For automatic startup, set startup value `1` on `<task>_running`; execution waits until task and fixed-channel configuration is ready.

### Runtime

Starting grants no channel authority; [acquire it explicitly](Channels%20and%20Control.md#start). Hold retains state, authority, and output values. Resume continues the same run without repeating start.

### Stop and Cleanup

**Tasks, sequences, state machines, workers, timelines, and loops release their channel authority to `free`, and clear authority fields when stop completes.** `observe_only` channels are kept in `observe_only`. Active work and end handling finish first. Sequences also clean up when their procedure completes. Put final commands in `end:` or the driver's end handler.

**Channels, last values, and history remain.** Other controllers and operator overrides are preserved. [Channels and Control](Channels%20and%20Control.md#stop) explains policy and override details. Remove leftover channels separately with **Channel Cleanup** in the [Project board](../Interface/Node%2C%20Context%2C%20and%20Project%20Board.md#project-actions-and-references).

### Removal and Replacement

**Calculations and event handlers release owned authority when removed or replaced**, after active work finishes. Returning from an evaluation or clearing a condition is not removal; use `free` if control should end while the artifact remains installed.

- **Callbacks** use caller authority; removing a registration does not clear the caller's claims.
- **Task groups** own ordering; removing a group preserves its members' running state and authority.

Module changes use reload; DCode changes use activation. [Runtime Blocks and Activation](../DCode/Runtime%20Blocks%20and%20Activation.md) explains when source changes replace or remove live definitions.

## Reference

For client calls, use the generated [Modules](Reference/TEMPEST/Operations/Modules.md) and [registered tasks](Reference/TEMPEST/Operations/dartwic/get-registered-tasks.md) references.
