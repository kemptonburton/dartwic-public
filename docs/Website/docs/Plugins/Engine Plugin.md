---
summary: Create a native plugin, register behavior, and build it for your engine.
updated: 2026-10-20T18:59
created: 2026-09-06T14:32
---

An engine plugin is a native library loaded by DARTWIC. It registers reusable behavior when loaded and can create module instances from project configuration. Start with the [example project](Overview.md#start-from-the-example); this guide uses its existing class and build setup.

## 1. Set the plugin identity

Edit the root `plugin.json`. Keep `contains_engine_plugin: true`, and set `contains_interface_plugin` to whether you ship UI. Set `minEngineVersion` to the oldest engine you actually support. Keep the plugin ID consistent in the manifest, interface definition, and generated output folders. The [manifest table](Packaging%20and%20Installation.md#manifest) explains every required field.

## 2. Register one operation

In `engine/src/example_device_plugin.cpp`, the starter's `onPluginLoaded()` registers features through the provided `dartwic` SDK pointer. This operation returns the caller's payload:

```cpp
void ExampleDevicePlugin::onPluginLoaded() {
    dartwic->registerOperation(
        "echo",
        "Echo",
        [](const%20nlohmann%3A%3Ajson%26%20payload) {
            return nlohmann::json{{"echo", payload}};
        }
    );
}
```

Local registration IDs are prefixed with your plugin ID. With the unmodified starter, the operation is `example_device_plugin.echo`. It can be called through the [Python client](../Clients/Python%20Client.md) or another TEMPEST client:

```python
response = client.operation("example_device_plugin.echo", {"message": "hello"})
response.raise_for_error()
print(response.payload["echo"])
```

Export the Engine SDK ABI version before the factory. The engine checks it before constructing the plugin, so a library built against an older C++ SDK is rejected with a rebuild diagnostic instead of calling an incompatible virtual method. Keep both exports in the starter:

```cpp
DARTWIC_PLUGIN_EXPORT uint32_t dartwicEngineSdkAbiVersion() noexcept {
    return DARTWIC::Plugins::ENGINE_PLUGIN_SDK_ABI_VERSION;
}

DARTWIC_PLUGIN_EXPORT DARTWIC::Plugins::BasePlugin* createPlugin(
    nlohmann::json cfg,
    DARTWIC::API::SDK_API* api
) {
    return new Example::ExampleDevicePlugin(cfg, api);
}
```

## 3. Add a module for a device

Register a module type during `onPluginLoaded()` (the example calls `registerExampleDeviceDriver` to do this), then return an instance from `createModule`:

```cpp
dartwic->registerModuleType({
    .id = "example_device",
    .name = "Example Device"
});
```

```cpp
DARTWIC::Modules::BaseModule* ExampleDevicePlugin::createModule(
    const std::string& module_type_id,
    nlohmann::json cfg,
    DARTWIC::API::SDK_API* api
) {
    if (module_type_id != "example_device") return nullptr;
    return new ExampleDeviceModule(cfg, api);
}
```

The factory receives the **local** type ID. Each module instance receives merged configuration and its SDK pointer. Own the device connection, retry state, and cleanup in the module. Put scheduled reads in a registered loop or task; avoid blocking acquisition or control with unrelated network work.

For DCode functions, register one input and output schema with ordinary JSON and optional prepared handlers. Both handlers run synchronously. They may change argument values in place while preserving the declared types, list lengths, and dictionary keys; DCode aliases see those changes when the call returns. The prepared handler receives mutable, call-scoped views and a call-scoped result writer. Do not retain their pointers or spans. Repeated prepared C++ task bodies accept fixed numeric collections and reject unsupported collection retention during preparation. Native callable helpers, callbacks, calculations, lifecycle work, and one-shot blocks retain ordinary allocating collection behavior; Lua retains resizable collections. Rebuild plugins against the current Engine SDK after this argument ABI change.

[Modules](../Engine/Modules.md) explains instance configuration. The example also demonstrates task types, DCode functions, a loop, and a custom TEMPEST peer transport.

## 4. Publish channels and respect authority

Using the SDK pointer inside your implementation:

```cpp
using DARTWIC::API::ChannelField;
using DARTWIC::API::RecordMode;
api->upsertChannelField("demo_temperature", ChannelField::VALUE, 23.5);
api->upsertChannelField("demo_temperature", ChannelField::UNITS, std::string("degC"));
api->upsertChannelField("demo_temperature", ChannelField::STALE_TIMEOUT, 2.0);
api->upsertChannelField("demo_temperature", ChannelField::RECORD_MODE, RecordMode::OnValueChange);
```

For automation-owned outputs, use `claimChannel` or `commandChannel`; for owner-updated diagnostics use `setChannel`. Plain value updates do not claim a free channel. Read [Commanding and Control](../Engine/Commanding%20and%20Control.md) before exposing outputs.

A value commit can run dependent DCode calculations and event reactions inline. Telemetry delivery and recording run asynchronously. Your driver determines whether an accepted output is sent immediately, queued, or picked up on its next poll. Document that behavior and expose feedback or failure diagnostics; an accepted channel write alone does not prove a device acted.

## 5. Build and load

For a driver feeding native DCode, [declare fixed channels during configuration](../Engine/Channels.md#declare-the-producers-channels) and reuse resolved batch handles in acquisition callbacks. [DARTWIC Builder](../Engine/DARTWIC%20Builder.md) reports layout changes and rebinding of loaded consumers.

Call `TaskRuntime::setFixedInputChannels` from `on_configure`. Every declared name must refer to fixed storage when configuration completes; a missing or dynamic input now fails task preparation with a named error. An empty declaration remains valid for a task with no fixed inputs. Calls from other callbacks throw, so changing a running task's input plan requires reconfiguration.

Install a supported C++ toolchain, CMake, and the vcpkg dependencies listed in the starter. Set `VCPKG_ROOT` to your vcpkg checkout, then run from the plugin root:

```sh
npm run package
```

For a debug engine, use `npm run package-debug`. Match operating system, architecture, SDK, and debug/release runtime. Follow [Packaging and Installation](Packaging%20and%20Installation.md) to install the output, restart the host, and check the loaded plugin before creating module instances.

For a complete acquisition, DCode automation, and device-write example, see [Building a hardware driver](Building%20a%20Hardware%20Driver.md).

## SDK map

| Capability | Reference |
| --- | --- |
| Plugin entry and lifecycle | [BasePlugin](Reference/Engine/Lifecycle/BasePlugin.md) |
| Module instances | [BaseModule](Reference/Engine/Modules/BaseModule.md) |
| Channel updates | [Channels](Reference/Engine/Channels/Overview.md) |
| Control ownership | [Channel Authority](Reference/Engine/Channel%20Authority/Overview.md) |
| Tasks and loops | [Engine SDK](Reference/Engine/Overview.md) |
| Native script functions | [DCode](Reference/Engine/DCode/Overview.md) |
| Request handlers | [Operations](Reference/Engine/Operations/Overview.md) |
| Register a TEMPEST peer transport | [TEMPEST peer registration](Reference/Engine/TEMPEST/Overview.md) |
| Custom frame delivery and protocol APIs | [TEMPEST peer SDK](Reference/TEMPEST/Overview.md) |

The [TEMPEST peer guide](../Engine/TEMPEST%20Peers.md) explains the connection and channel lifecycle.

If a library fails to load, check the engine log for missing dependencies or entry points. If the plugin loads but a module does not, check the instance's `plugin`, `module_type`, and parameter values.
