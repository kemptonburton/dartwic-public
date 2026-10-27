---
summary: Follow the Engine plugin entry point, registration flow, and SDK services.
updated: 2026-10-27T15:01
created: 2026-09-06T14:32
---

An Engine plugin extends DARTWIC with native C++ code. It can supply reusable work, script functions, device connections, or communication features. Choose the contributions your plugin needs; a plugin does not have to include a module or a hardware driver.

Start from the [example plugin](Overview.md#example-plugin). The source paths below belong to **your plugin repository**. Keep the starter's SDK, entry-point exports, and build setup while adding your implementation.

# Plugin Config

The root **`plugin.json`** identifies your plugin and tells the host which sides it contains. For the combined Engine/Interface examples on these pages:

```json
{
  "id": "example_device_plugin",
  "name": "Example Device Plugin",
  "description": "Native behavior and its operator tools.",
  "author": "Your team",
  "version": "1.0.0",
  "minEngineVersion": "2.0.0",
  "minInterfaceVersion": "2.0.0",
  "contains_engine_plugin": true,
  "contains_interface_plugin": true
}
```

Keep `contains_engine_plugin: true`; set `contains_interface_plugin: false` if you are not shipping UI. Set each minimum version to the oldest host you actually support. The [manifest guide](Packaging%20and%20Installation.md#manifest) owns field definitions and package layout.

Module types can also reference bundled `module_config.json` and `default_parameters.json` through their registration's `config_path` and `default_parameters_path`. These describe the type and its default parameters. A user's module instance and task arguments are separate workspace configuration; [Building a Hardware Driver](Building%20a%20Hardware%20Driver.md#configs) shows those files when your plugin needs them.

# Plugin Lifecycle

The Engine loads the native library, checks its SDK ABI export, and calls `createPlugin` to construct your `BasePlugin` subclass. It then calls **`onPluginLoaded()`**, the main hook for registering what your plugin provides.

```text
Load library → Check ABI → createPlugin → onPluginLoaded
                                           └─ Register types and handlers
                                                └─ Runtime calls them as needed
```

In the starter, this lives in `engine/src/example_device_plugin.cpp`. `BasePlugin` keeps the supplied `SDK_API*` as **`dartwic`**. Use it to register features inside `onPluginLoaded()` and to access Engine services from their callbacks. Keep the `createPlugin` and `dartwicEngineSdkAbiVersion` exports; [BasePlugin](Reference/Engine/Lifecycle/BasePlugin.md) documents that boundary.

The starter already supplies the exports below. Keep them while changing your plugin class and its registrations:

```cpp
DARTWIC_PLUGIN_EXPORT uint32_t dartwicEngineSdkAbiVersion() noexcept {
    return DARTWIC::Plugins::ENGINE_PLUGIN_SDK_ABI_VERSION;
}

DARTWIC_PLUGIN_EXPORT DARTWIC::Plugins::BasePlugin* createPlugin(
    nlohmann::json cfg, DARTWIC::API::SDK_API* api) {
    return new Example::ExampleDevicePlugin(std::move(cfg), api);
}
```

When the Engine constructs your plugin, `BasePlugin::config` receives the manifest merged with effective `plugins.<plugin-id>` settings. This is plugin-wide configuration; `createModule` receives a particular module instance's configuration. Use [Storage and Settings](Storage%20and%20Settings.md) for scoped settings rather than creating another configuration store.

Uninstalling the Engine side queues removal for the next Engine restart. `BasePlugin` has no unload callback. Release plugin-owned resources in your subclass's destructor, including stopping and joining any threads you created. Keep task cleanup in its `on_end` / `cleanup` callbacks and module resources with the module. 

Uninstall leaves saved workspace documents and separately stored settings and assets in place; Bundled assets are removed with the package; [Storage and Settings](Storage%20and%20Settings.md) explains those storage lifetimes.

# Plugin Registrations

For the full current API, use the [Engine SDK reference](Reference/Engine/Overview.md) and the `register*` declarations in your bundled `engine/include/sdk/sdk_api.h`. The examples below illustrate the main registration patterns; check your target SDK for available methods and exact fields.

Registration describes capabilities available while your plugin is loaded. The Engine calls their handlers when work is configured, scheduled, or requested. Add registrations inside `onPluginLoaded()` alongside the starter features you keep.

| Contribution | What it adds | SDK entry point |
| --- | --- | --- |
| Task type | Reusable work with its own configured instances and lifecycle. | [`registerTaskType`](Reference/Engine/Tasks%20and%20Loops/SDK_API-registerTaskType.md) |
| DCode function | A native helper callable from DCode scripts. | [`registerDCodeFunction`](Reference/Engine/DCode/SDK_API-registerDCodeFunction.md) |
| Module type | Configured instances owning a device connection or shared service. | [`registerModuleType`](Reference/Engine/Modules/SDK_API-registerModuleType.md) |
| Plugin loop | Background plugin work, such as discovery or connection monitoring. | [`registerLoop`](Reference/Engine/Tasks%20and%20Loops/SDK_API-registerLoop.md) |
| Operation | A request/response handler that clients or scripts can call. | [`registerOperation`](Reference/Engine/Operations/SDK_API-registerOperation.md) |
| Telemetry topic | Custom updates published to subscribed clients and peers. | [`registerTelemetry`](Reference/Engine/Operations/SDK_API-registerTelemetry.md) |
| Device peer | Translate a device protocol using the Engine-supplied Peer and EngineProtocol. | [`registerPeer`](Reference/Engine/TEMPEST/SDK_API-registerPeer.md) |
| DARTWIC transport | Carry standard DARTWIC peer messages over a custom link. | [`registerPeerTransport`](Reference/Engine/TEMPEST/SDK_API-registerPeerTransport.md) |

Local registration IDs are qualified with your plugin ID. For example, registering `echo` in the starter produces `example_device_plugin.echo`.

## TEMPEST operations

A **TEMPEST operation** exposes a request/response handler to clients, the Interface, and script calls. This adds `example_device_plugin.echo`, with argument metadata for callers and operator tools:

```cpp
void Example::ExampleDevicePlugin::onPluginLoaded() {
    dartwic->registerOperation(DARTWIC::API::OperationDefinition{
        .id = "echo",
        .name = "Echo",
        .description = "Return the supplied message.",
        .arguments = {{.name = "message", .type = "string",
                       .description = "Text to echo.", .required = true}},
        .handler = [](const nlohmann::json& payload) {
            return nlohmann::json{{"echo", payload}};
        }
    });
}
```

The handler runs when the operation is called, not when it is registered. This is a plugin extension operation carried by TEMPEST. See the [operation registration reference](Reference/Engine/Operations/SDK_API-registerOperation.md) for descriptors and access options.

## Tasks

A **task type** defines behavior that can be reused by several configured tasks. Registering it does not create or start those instances. Each instance supplies its own arguments and runtime state; its structure selects how it executes, such as periodic work or a long-running worker.

Use `on_configure` to prepare bindings and buffers, `on_start` to begin a run, `on_task` for its work, and `on_end` / `cleanup` to finish and release state. `on_missed` handles skipped scheduled releases. The supplied [TaskRuntime](Reference/Engine/Tasks%20and%20Loops/TaskRuntime.md) exposes the instance's name, arguments, elapsed time, stop request, and retained context.

For a small periodic task, add this inside `onPluginLoaded()`. Each instance publishes its elapsed seconds on its own channel:

```cpp
using namespace DARTWIC::API;
TaskTypeDefinition elapsed;
elapsed.metadata.structure = TaskStructure::Periodic;
elapsed.on_task = [api = dartwic](const TaskTypeDefinition&,
                                TaskRuntime& task, double seconds) {
    api->upsertChannelField(task.getTaskName() + "_elapsed",
                            ChannelField::VALUE, seconds);
};
dartwic->registerTaskType("elapsed", "Elapsed time", std::move(elapsed));
```

Configure a task using type `example_device_plugin.elapsed`, choose its rate, then start it. This simple example publishes by name; the driver guide shows preparing fixed handles for repeated device I/O.

## Plugin loops

A **plugin loop** instead supplies plugin-level work without requiring a task instance for every device. [Modules and Tasks](../Engine/Modules%20and%20Tasks.md) explains lifecycle; [Building a Hardware Driver](Building%20a%20Hardware%20Driver.md) shows task registration, module binding, and discovery loops together.

A plugin-wide loop can instead be registered directly. This one publishes a constant health marker once per second:

```cpp
dartwic->registerLoop("heartbeat", "Plugin heartbeat", {
    .on_loop = [api = dartwic]() {
        api->upsertChannelField("example_heartbeat", DARTWIC::API::ChannelField::VALUE, 1.0);
    },
    .target_frequency_hz = 1.0,
});
```

Each accepted write refreshes the channel timestamp even when its value stays `1`. The marker describes this loop's activity, not device health.

## DCode functions

A **DCode function** lets a script call your C++ implementation directly, for example a calculation or a device-specific command helper. Register its input and result schema alongside its handler. Scripts call the qualified name; [Modules and Native Functions](../DCode/Modules%20and%20Native%20Functions.md#call-a-native-function) shows the example plugin's calls from DCode.

For example, add a numeric helper inside `onPluginLoaded()`:

```cpp
dartwic->registerDCodeFunction(
    "double_value", "Double value",
    [](const nlohmann::json& payload) {
        return nlohmann::json(payload.at("value").get<double>() * 2.0);
    },
    "Multiply a number by two.",
    {{"value", "number", "Input number.", true}},
    {{"result", "number", "Doubled number.", true}}
);
```

With that plugin loaded, an executable DCode body can call it:

```dcode
local doubled = example_device_plugin.double_value({value: 12.5})
|demo_doubled| = doubled
```

The declared result has one field, so the handler returns a scalar here.

The call is synchronous: the script waits for your handler, including its I/O, locks, and calculations. Ordinary JSON and optional prepared handlers share one schema. Prepared argument views and result writers last only for that call; see the [registration reference](Reference/Engine/DCode/SDK_API-registerDCodeFunction.md) for types, mutation, and fixed-shape rules.

## Module instances

A **module** owns a configured connection or service shared by tasks. Register its type in `onPluginLoaded()`, then implement `createModule` to return a [BaseModule](Reference/Engine/Modules/BaseModule.md) for that local type ID. The factory receives the instance's merged configuration and SDK pointer.

The starter's simulated device illustrates both sides. Inside `onPluginLoaded()`, advertise the type:

```cpp
dartwic->registerModuleType({.id = "example_device", .name = "Example Device"});
```

Return its instance from the factory when that local type is requested:

```cpp
DARTWIC::Modules::BaseModule* Example::ExampleDevicePlugin::createModule(
    const std::string& type, nlohmann::json cfg, DARTWIC::API::SDK_API* api) {
    if (type != "example_device") return nullptr;
    return new Example::ExampleDeviceModule(std::move(cfg), api);
}
```

`ExampleDeviceModule` is the starter's module implementation; your driver would supply its own class.

Keep connection settings and device lifetime on the module, and repeated work on its tasks or loop. The [driver guide](Building%20a%20Hardware%20Driver.md) covers this implementation without requiring every plugin to follow a device pattern.

## Telemetry topics

A telemetry topic sends custom updates independently of operation responses. Register its description once, then publish from your runtime work. Here a plugin loop supplies the updates:

```cpp
dartwic->registerTelemetry(DARTWIC::API::TelemetryDefinition{
    .id = "status", .name = "Plugin status",
    .description = "Periodic plugin readiness.",
    .delivery = "Published once per second while the loop runs."
});
dartwic->registerLoop("status_updates", "Status updates", {
    .on_loop = [api = dartwic]() {
        api->publishTelemetry("status", {{"ready", true}});
    },
    .target_frequency_hz = 1.0,
});
```

Clients handle the qualified topic `example_device_plugin.status`. Delivery is best effort; publishing does not create recorded channel history. See [telemetry registration](Reference/Engine/Operations/SDK_API-registerTelemetry.md) and [publication](Reference/Engine/Operations/SDK_API-publishTelemetry.md).

## Peer types

A transport registration adds a link option for the standard DARTWIC peer. This uses the starter's `ExampleTransport`, whose implementation supplies the actual connection, message delivery, and diagnostics:

```cpp
#include "example_transport.h"
#include <dartwic/EngineProtocol.h>

// Inside onPluginLoaded():
dartwic->registerPeerTransport({
    .id = "example_flight_link", .name = "Example Flight Link",
    .default_config = {
        {"node_name", "external-program"},
        {"receive_endpoint", "tcp://127.0.0.1:17600"},
        {"send_endpoint", "tcp://127.0.0.1:17601"}
    },
    .protocol_id = "tempest.engine",
    .protocol_version = DARTWIC::EngineContract::version,
    .engine_protocol = true,
    .create = [](const nlohmann::json& cfg) {
        return std::make_shared<Example::ExampleTransport>(cfg);
    }
});
```

Keep includes at file scope. Registration makes the connection type available; [Network Map](../Interface/Network%20Map.md) configures a connection using it. [Building a Custom Peer](Building%20a%20Custom%20Peer.md) explains custom transports and protocol bridges. Use the [transport registration reference](Reference/Engine/TEMPEST/SDK_API-registerPeerTransport.md) for the full definition.

# Engine APIs

The **Engine Plugin SDK** exposes normal Engine services through `SDK_API`. In your starter, `engine/include/sdk/sdk_api.h` declares that interface, with supporting types and helpers alongside it. The generated reference explains their arguments and behavior.

Your registered handlers, tasks, and modules use these APIs to do their work:

| Need | API area |
| --- | --- |
| Read/publish signals or command an output | [Channels](Reference/Engine/Channels/Overview.md) and [Channel Authority](Reference/Engine/Channel%20Authority/Overview.md) |
| Report conditions or diagnostic output | [Events](Reference/Engine/Events/Overview.md) and [Logs](Reference/Engine/Logs/Overview.md) |
| Call operations or publish custom updates | [Operations](Reference/Engine/Operations/Overview.md) |
| Read settings, private files, or portable assets | [Storage and Settings](Storage%20and%20Settings.md) |
| Offer an operator workflow | [Interface UI and Notifications](Reference/Engine/Interface%20UI%20and%20Notifications/Overview.md) |

For example, a simulated publisher can update a channel and write a log through the same SDK pointer used for registration:

```cpp
using DARTWIC::API::ChannelField;
dartwic->upsertChannelField("demo_temperature", ChannelField::VALUE, 23.5);
dartwic->upsertChannelField("demo_temperature", ChannelField::UNITS, std::string("degC"));
const bool queued = dartwic->writeLog("Setup", "Temperature source ready");
```

`queued` reports whether ARGUS accepted the log entry for asynchronous writing.

Channel writes still obey authority. Ordinary updates use existing authority without acquiring it. Prepare fixed handles and device resources during configuration; explicitly acquire publishing authority on each start before ordinary sample writes. [Channels and Control](../Engine/Channels%20and%20Control.md#native-daq-with-fixed-channels) contains the proposed native DAQ walkthrough and four optional-value authority operations. That revision is under review; its new overloads and lifecycle behavior are not yet uniformly implemented in the SDK.

Accepted writes can run dependent calculations inline. Recording and telemetry follow asynchronously; device delivery belongs to your driver. Report feedback and failures separately from command acceptance. For fixed-channel preparation, use [DARTWIC Builder](../Engine/Advanced/DARTWIC%20Builder.md).

# Building and Installation

Use [Packaging and Installation](Packaging%20and%20Installation.md) for tools, build commands, output layout, local installation, and releases.

After installation or an update, restart the selected Engine and check that the plugin loaded. Then configure and exercise the contributions you added. If loading fails, check the Engine log for ABI, dependency, or entry-point errors; [Plugins](../Interface/Plugins.md) explains installed and loaded states.

For the `echo` registration above, an already connected client can check dispatch:

```python
response = client.operation("example_device_plugin.echo", {"message": "hello"})
response.raise_for_error()
print(response.payload["echo"]["message"])  # hello
```

This checks the registered handler. Test each task, device, or UI contribution separately before treating the whole plugin as verified.

# Reference

- [Engine SDK reference](Reference/Engine/Overview.md) — The full registration and service API.
- [Plugin lifecycle](Reference/Engine/Lifecycle/BasePlugin.md) — Entry points, construction, and lifecycle hooks.
