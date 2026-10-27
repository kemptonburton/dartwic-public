---
summary: Understand device services, runtime work, and configuration/start/stop boundaries.
created: 2026-09-04T17:13
updated: 2026-10-26T20:11
---

A **module** gives the Engine a device connection or shared service. A **task** does work, such as reading that device, calculating a command, or running a procedure.

For example, one Modbus module connects to a controller. Its read task publishes measurements to channels, while its write task sends channel commands to the device. Several tasks can use the same module without each opening its own connection.

# Configuration and registration

Configuration describes what to create and how it should behave. Registration makes that work available in the Engine; starting begins its execution. Saving a file, loading its declarations, and starting a task are separate steps.

| Stage | Result |
| --- | --- |
| Install a plugin | Its files become available; native code loads at Engine restart. |
| Configure a module | Resolves its type and parameters, merges defaults, and creates its device/service instance. |
| Configure a plugin task | Selects its implementation, module, and arguments. |
| Activate DCode | Executes activation work and registers or reconfigures its declarations. |
| Start a task | Begins the configured implementation's run lifecycle. |

A driver may also acquire data through a loop or its own background worker. Its implementation determines sampling and device behavior; inspect connection and transaction results after configuration.

For a Modbus example, install and load the Modbus TCP plugin, then use a simulator or device with a known register map. This is a project module resource, such as `modules/bench_io.json`; it selects the connection and a 200 ms transaction timeout:

```json
{
  "name": "bench_io",
  "plugin": "modbus_tcp_client",
  "module_type": "tcp_client",
  "parameters": {
    "server_ip": "127.0.0.1",
    "server_port": 502,
    "unit_id": 255,
    "tv_sec": 0,
    "tv_usec": 200000
  }
}
```

After configuring it, check the module's connection status. The file creates the connection configuration; acquisition begins through the linked task. These fields belong to the Modbus plugin, and its register/channel mappings belong to task arguments. This implementation supports at most one read task and one write task per module. [Building a Hardware Driver](../Plugins/Building%20a%20Hardware%20Driver.md) explains those mappings. [Its discovery section](../Plugins/Building%20a%20Hardware%20Driver.md#discovery-loop) covers reviewed setup offered by drivers.

# Task structures and lifecycle

A task's **structure** describes how its work runs. Its **type** identifies the implementation supplied by DCode or a plugin. A callback is the function the Engine invokes for one step or lifecycle action.

| Structure | Work |
| --- | --- |
| Periodic | Repeated callback at a requested frequency. |
| State machine | Scheduled behavior for the current named state. |
| Sequence | Ordered work with managed progress. |
| Timeline | Work organized around a timeline clock and its scheduled actions. |
| Worker | Long-running work whose internal repetitions belong to the worker. |

Native structure names do not necessarily have matching DCode keywords.

## Startup and stop

Task controls use channels such as `<task>_running`, `<task>_hold`, and `<task>_target_frequency`. A declared DCode frequency initializes a new task's target; reconfiguration preserves the existing target, including operator adjustments.

A startup value of `1` on `_running` requests startup execution. The Engine defers those callbacks until task and fixed-channel configuration is complete. Runtime control writes record lightweight requests synchronously; lifecycle handlers execute later on the task or group thread.

Follow one task through its run:

| Action | What happens | What to check |
| --- | --- | --- |
| Start | The start handler runs, then execution begins. | Running state, current measurements, and any start error. |
| Hold | Supported execution pauses with state and authority retained. | Held state; an in-flight callback may still be finishing. |
| Resume | The same run continues without repeating start. | Work and measurements advance again. |
| Request stop | The task begins stopping and clears hold. | Acknowledging the request is not completed cleanup. |
| Complete stop | Active work and end handling finish; the artifact releases its claims. | The task has finished stopping. Last channel values remain. |

A blocked callback must return before its stop can finish; the Engine cannot forcibly terminate it.

Completed stop removes the artifact's underlying, active, and suspended claims. Observe-only channels retain their protection without the stopped publisher; unrelated controllers and operator overrides remain. [Channels and Control](Channels%20and%20Control.md#caesar-lifecycle) explains the authority results.

Cleanup retains the last accepted value. Final equipment commands belong in a DCode `end:` handler or driver shutdown path; verify physical feedback. [Channels and Control](Channels%20and%20Control.md#stop) explains completed-stop cleanup.

# Reload and deletion

Reload applies changed configuration to the running setup. A binding connects code to a channel; mapping changes can require [Builder](Advanced/DARTWIC%20Builder.md) to prepare those bindings again.

Deletion is a separate workflow. Review its affected resources in Project Actions; the Engine then carries out these steps:

| Deletion step | Consequence |
| --- | --- |
| Stop affected tasks | Waits for active callbacks and releases applicable authority. |
| Release affected task groups | Removes group ordering; surviving members retain running state with independent scheduling. |
| Remove linked tasks/module | Removes runtime resources and selected saved configuration. |
| Clean owned channels | Removes the reviewed owned outputs; read-only inputs are reference evidence. |
| Save snapshot | Persists resulting channel configuration. |

Surviving tasks that reference deleted channels remain stopped for repair. Retained DCode source can recreate resources on later activation. An unavailable plugin or malformed configuration does not prevent removal of that saved module file, but unknown associations cannot be inferred.

Project Actions refresh evidence at Apply, report partial outcomes, and support retry. The [Project board guide](../Interface/Node%2C%20Context%2C%20and%20Project%20Board.md#project-actions-and-references) owns review, rename, cancellation, and operator instructions.

# Scheduling and APIs

[Execution and Timing](Execution%20and%20Timing.md) explains periodic releases and task-group ordering. [Diagnostics](Diagnostics%20and%20Troubleshooting.md#task-health-and-failures) explains counters and completion deadlines.

Use the generated [Modules](Reference/TEMPEST/Operations/Modules.md) and [registered tasks](Reference/TEMPEST/Operations/dartwic/get-registered-tasks.md) references for client calls. Implementers start with [Engine Plugin](../Plugins/Engine%20Plugin.md) and [BaseModule](../Plugins/Reference/Engine/Modules/BaseModule.md).

[DCode Tasks](../DCode/Tasks.md) owns script examples for periodic, state-machine, and sequence bodies. This guide covers their Engine configuration and lifecycle.
