---
summary: Follow the Modbus plugin from a device connection to fixed-channel read and write tasks.
updated: 2026-10-20T18:59
created: 2026-10-04T18:31
---

A hardware driver translates between a device's protocol and DARTWIC channels. The [Modbus TCP plugin](https://github.com/kemptonburton/dartwic-modbus-tcp-client) is a working example: a module owns the connection, a read task publishes measurements, and a write task sends channel commands to the device.

Read this alongside the plugin source. To practice without hardware, use the [example workspace](../Getting%20Started/Example%20Workspace.md). The simulator uses the same module-and-task pattern, but its device fields are different from Modbus register mappings.

## Start with one device connection

The plugin registers module type `tcp_client` and task types `modbus_tcp_client.read` and `modbus_tcp_client.write`. Each module supports at most one read task and one write task. They share its connection and connection mutex.

Create the module through the Interface, or use the configuration in [Modules](../Engine/Modules.md). Set the device address, port, unit ID, and timeout from the device's documentation. The module's connection status and the task's transaction result answer different questions: a connected device can still reject a register request.

The main source files are:

- [modbus_tcp_client_module.cpp](https://github.com/kemptonburton/dartwic-modbus-tcp-client/blob/main/engine/src/modbus_tcp_client_module.cpp): module factory, task registration, mappings, fixed handles, and periodic I/O.
- [modbus_tcp_client.cpp](https://github.com/kemptonburton/dartwic-modbus-tcp-client/blob/main/engine/src/modbus_tcp_client.cpp): connection, protocol transactions, errors, and reconnect behavior.
- [modbus_device_discovery.cpp](https://github.com/kemptonburton/dartwic-modbus-tcp-client/blob/main/engine/src/modbus_device_discovery.cpp): detection and provisioning suggestions.

Start a new plugin from the [public starter](Overview.md#start-from-the-example), then adapt this structure to your protocol. Keep protocol details in the module instead of duplicating a connection in every task.

## Map registers to channels

A read task's arguments select the module and the registers to publish. This example reads one raw input register from a module named `bench_io`:

```json
{
  "module_instance_name": "bench_io",
  "read_mappings": [
    {"register": 0, "register_type": "input_register", "channel": "bench_pressure_raw"}
  ]
}
```

This is the task's **arguments object**, not a complete task file. Use the task editor to create the surrounding resource. Register numbers are protocol addresses; translate any vendor numbering convention before entering them. The plugin publishes raw register values. Put engineering-unit conversion in a [channel calculation](../DCode/Channel%20Calculations.md) when appropriate.

A write task can map a command and an optional readback channel:

```json
{
  "module_instance_name": "bench_io",
  "write_mappings": [
    {
      "register": 0,
      "register_type": "coil",
      "channel": "bench_valve_command",
      "readback_channel": "bench_valve_coil_readback"
    }
  ]
}
```

Only use a register your device documents as writable. A coil readback confirms the device's reported coil state; a separate position sensor is needed to confirm valve movement.

## Prepare the repeated work

During `on_configure`, the plugin validates mappings, groups adjacent registers, allocates reusable transaction buffers, and creates fixed channels. It keeps their handles in the task's runtime context. The write task declares its command inputs with `setFixedInputChannels`.

This moves mapping parsing, channel-name resolution, and buffer sizing out of each cycle. A mapping change therefore needs task reconfiguration. Do not replace retained handles with a name lookup fallback inside the periodic callback.

The [fixed-channel SDK](Reference/Engine/Channels/Overview.md) provides creation, reads, and writes. A short setup fragment looks like this:

```cpp
auto pressure = api->createFixedChannel("bench_pressure_raw", 0.0);
// Keep pressure in task context; use it in the periodic callback.
```

Fixed channels follow normal [command authority](../Engine/Commanding%20and%20Control.md). They reserve storage; they do not grant a driver permission to overwrite another controller.

## Follow one cycle

The read task performs its Modbus transactions under the module connection mutex. It releases that mutex before publishing completed blocks to RAPID. A failed block does not become a new zero measurement; some other blocks may already have succeeded.

The write task first reads command handles into its prepared buffers, then locks the connection and performs the writes and configured readbacks. It publishes results after releasing the connection lock. Reads and writes are separate transactions, so do not treat all mapped channels as one atomic device update.

The plugin exposes `<task_name>.modbus.transaction_time_ms`, `stale`, `failure_count`, and `reconnect_count`. Inspect these alongside `<module_name>.info.connected` and the channel timestamps. The stale diagnostic describes transaction success; it is not proof that every RAPID publication was accepted under channel authority.

## Choose a rate and check the result

Begin with one documented register on a simulator or bench device. Confirm the value and units, then add the remaining mappings. For an output, compare the requested value, protocol readback, and physical feedback where available.

The Modbus timeout and shared connection lock can dominate the task period. Preparing fixed channels does not make TCP or a device response real-time. Measure transaction duration, missed cycles, failure counts, and feedback before increasing the rate. Disconnect the device and check what remains visible, what stops updating, and what happens after reconnect.

Use a [task group](../Engine/Tasks.md#put-related-tasks-in-a-task-group) when read, control, and write must run in a declared order. The controller must still decide what to do with invalid or old input. [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md) explains the compiled option for repeated control logic.

Stop the tasks when finished and follow the device's shutdown procedure. Stopping a task or releasing a channel does not, by itself, send a safe value to the equipment.

## Offer setup through discovery

The Modbus plugin can detect responding endpoints and suggest a module, channels, and read/write tasks. [Device Discovery and Provisioning](Device%20Discovery%20and%20Provisioning.md) follows that process and explains what the scan can infer.

Once your driver works, add its task/module editors through the [Interface SDK](Interface%20Plugin.md), then [package it](Packaging%20and%20Installation.md) with its defaults and required libraries.
