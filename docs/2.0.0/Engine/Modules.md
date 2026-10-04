---
updated: 2026-06-23T04:29
created: 2026-06-23
---

A module is custom C++ runtime lifecycle created by an engine plugin. Use a module when DARTWIC needs to drive hardware, communicate with an external data source, host a reusable runtime service, or keep a long-lived integration running inside the engine.

DCode tasks are different: they are for easy automation logic using channels that already exist in DARTWIC. Modules are for adding the runtime capability that creates, reads, writes, or manages those channels in the first place.

# Example: Modbus PLC Module

A Modbus PLC module might:

- open and maintain a TCP connection to a PLC
- poll register blocks on a schedule
- publish each register as a RAPID channel with units and stale timeouts
- translate operator command channels into Modbus writes
- set `record_mode` on channels that should be trended
- raise ARGUS warnings when the PLC disconnects or returns invalid data
- expose module parameters such as host, port, unit id, register map, and polling rate

In that design, the module owns the C++ lifecycle and external communications. A DCode task can then use the resulting channels for automation:

```dcode
task_periodic tasks/tank_guard:
    task elapsed_seconds:
        if |plc/tank_level.value| > |plc/tank_high_limit.value|:
            |plc/pump_enable.value| = 0
```

The module talks to the PLC. The DCode task uses the channel data that the module made available.

# Module Instance Config

The module manager scans the configured modules folder for `.json` files. Each file describes one module instance.

```json
{
  "name": "boiler_room_plc",
  "plugin": "modbus",
  "module_type": "modbus_tcp",
  "parameters": {
    "host": "192.168.1.25",
    "port": 502,
    "unit_id": 1,
    "poll_interval_ms": 100
  }
}
```

| Field | Meaning |
| --- | --- |
| `name` | Runtime instance name. Operators and SDK calls use this to identify the instance. |
| `plugin` | Installed engine plugin that creates the module. |
| `module_type` | Module type inside the plugin. If omitted, DARTWIC uses the plugin id as the module type id. |
| `parameters` | Instance-specific settings passed to the module. |

# Module Types

An engine plugin can expose one or more repeatable module types:

```cpp
struct PluginModuleType {
    std::string id;
    std::string config_path = "module_config.json";
    std::string default_parameters_path = "default_parameters.json";
};
```

`id` is the module type id. `config_path` points to the interface-side module config UI. `default_parameters_path` points to defaults that DARTWIC merges with the instance's `parameters`.

# Loading A Module

At startup, reload, or save-and-reload, the engine:

1. Reads the module instance JSON.
2. Resolves the plugin id and module type id.
3. Loads default parameters for the module type, if provided.
4. Merges instance parameters over those defaults.
5. Calls the plugin's `createModule(module_type_id, cfg, dartwic)` function.
6. Stores the returned `BaseModule` instance by name.
7. Sets the module's `plugin_id` and `module_type_id`.

If loading fails, the engine logs the module load error and does not create that instance.

# What A Module Can Do

A module receives an SDK API pointer. Depending on the plugin, it can:

- read, insert, update, or remove RAPID channels
- publish live telemetry into channel `value` fields
- set channel metadata such as `units`, `record_mode`, and `stale_timeout`
- translate external data into DARTWIC channels
- translate channel commands into device or service writes
- register CAESAR loop callbacks
- register custom task types
- expose engine operations for the interface or clients
- call or register DCode functions
- find other module instances

# Module Versus Task

| Use A Module When | Use A Task When |
| --- | --- |
| You need custom C++ lifecycle inside the engine. | You need automation logic over existing DARTWIC channels. |
| You are writing a device driver or external data-source integration. | You are writing periodic, worker, or state-machine behavior. |
| You need to own connection state, retries, polling, or protocol details. | You need start, stop, hold, release, frequency, or state controls. |
| The behavior should be packaged as an engine plugin module type. | DCode or a plugin task type is enough. |

Modules often create the channels. Tasks often automate with those channels.

# Managing Modules From The Interface

The interface uses engine operations to manage module instances:

| Operation | What It Does |
| --- | --- |
| `dartwic/modules/build-module-instance` | Builds a module instance JSON document from a plugin id, module type id, and instance name. |
| `dartwic/modules/reload-module-instance` | Reloads an instance from its JSON file. |
| `dartwic/modules/save-and-reload-module-instance` | Saves config changes and reloads the instance. |
| `dartwic/modules/delete-module-instance` | Removes the running module instance. |
| `dartwic/get-module-instances` | Lists loaded instances, optionally filtered by plugin id. |

# Read More

- [Plugins Overview](../Plugins/Overview.md)
- [Creating a Plugin](../Plugins/Creating%20a%20Plugin.md)
- [First Engine Plugin](../Plugins/First%20Engine%20Plugin.md)
- [Engine Plugin API](../Plugins/Engine%20Plugin%20API.md)
- [BaseModule Reference](../Plugins/Reference/Engine/BaseModule.md)
- [PluginModuleType Reference](../Plugins/Reference/Engine/PluginModuleType.md)
