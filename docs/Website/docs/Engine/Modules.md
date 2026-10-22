---
summary: Configure reusable driver and service instances supplied by engine plugins.
updated: 2026-10-20T16:22
created: 2026-09-04T17:13
---

A module is an instance of a device connection or service supplied by an engine plugin. For example, one Modbus module connects to one endpoint, while its read and write tasks use that connection.

Install the plugin before creating the module. Its registered module type supplies the available parameters and may provide a custom editor.

## Create an instance

In **Modules**, choose the plugin's module type, give the instance a unique name, and enter its parameters. This Modbus example connects to a local simulator; replace the endpoint and unit ID for your device:

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

Save it as a module resource in the project's `modules/` directory. These parameter names belong to the Modbus plugin; another driver defines its own configuration. This example selects a 200 ms transaction timeout.

## Connect tasks to the module

Create the plugin's read and write tasks and select `bench_io` in each task's module field. For Modbus, the types are `modbus_tcp_client.read` and `modbus_tcp_client.write`, with at most one of each per module. Their mappings belong in task arguments.

[Building a Hardware Driver](../Plugins/Building%20a%20Hardware%20Driver.md) shows mapping examples. [Device Discovery and Provisioning](../Plugins/Device%20Discovery%20and%20Provisioning.md) explains how a driver can offer this setup for review.

The [example workspace](../Getting%20Started/Example%20Workspace.md) uses a different module, `example_device_1`, with simulated device fields. Use its existing resource and simulated device parameters.

## Apply configuration

Save and reload through the module controls. The engine resolves the plugin and module type, merges parameters with the type's defaults, and creates the instance. Check the result, then inspect connection state and related task diagnostics before starting work.

Saving valid JSON does not establish that a device connected. A connected device also may not support the chosen register or command. Check readings, timestamps, transaction errors, and feedback from the actual device.

A module can acquire data through tasks, loops, or its own worker. The module abstraction does not set a sampling rate. Likewise, a command channel may be sent to hardware on a later write cycle. Use the driver's timing and shutdown behavior when designing automation.

## Delete an instance

Deleting a module through Project Actions prepares a cascade for review: stop affected tasks and wait for callbacks, release task groups containing the deleted tasks, remove linked tasks and their owned channels, remove the module and its configuration, remove module-owned channels, then save the channel snapshot. Each operation has its own progress row. Channels that a task only reads remain reference evidence; they are not automatically included in its owned-channel deletion list.

Review the listed resources before applying. The confirmation includes manual deletion authority when channel ownership or control requires it. Other tasks using removed channels stay stopped so you can repair their references before restarting. Releasing a task group removes its ordering configuration; surviving members keep their running state with independent scheduling.

A changed task configuration, module configuration, group membership, or channel impact invalidates the review. Refresh and review the updated steps. Cancellation retains completed deletions and reports partial results. Saved DCode declarations are not removed by this workflow; activating them again can recreate their resources.

## Useful operations

Connected clients can list instances with `dartwic/get-module-instances`. The `dartwic/modules/` operations build, save/reload, reload, or delete an instance. Use the [Modules operation reference](Reference/TEMPEST/Operations/Modules.md) for arguments and detached-job forms.

To implement a module, start with [Engine Plugin](../Plugins/Engine%20Plugin.md) and the [BaseModule reference](../Plugins/Reference/Engine/Modules/BaseModule.md).
