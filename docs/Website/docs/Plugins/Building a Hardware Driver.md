---
summary: Build a driver that reads device values into observe-only channels and writes channel commands back to the device.
updated: 2026-10-26T14:17
created: 2026-10-04T18:31
---

This guide describes how to build a full hardware driver plugin with:

A device module:

![](_attachments/Pasted%20image%2020261025221609.png)

A read task:

![](_attachments/Pasted%20image%2020261025221528.png)

A write task:

![](_attachments/Pasted%20image%2020261025221541.png)

And device detection and setup recommendations:

![](_attachments/Pasted%20image%2020261025220337.png)

A hardware driver moves values in two directions:

- **Read task:** read a measurement from the device and publish it as an observe-only channel.
- **Write task:** read a command channel and send its value to the device. Publish any device readback on a separate observe-only channel.

A module owns the device connection. Both tasks use that same module. A connection loop keeps its status current, and discovery can offer unconfigured devices for setup. The Interface edits the configuration that connects these pieces.

Start from the [plugin starter](Overview.md#start-from-the-example). The examples below use a fictional `bench_driver` with device fields named `pressure` and `valve`; no particular communication protocol is assumed. `DeviceConnection` and `DeviceFinder` stand for **code you implement using your device library**, not additional SDK APIs. Use the starter for the surrounding includes, build setup, plugin manifest, and exported entry points.

For a complete implementation, the [example plugin](https://github.com/kemptonburton/dartwic-example-plugin) uses a local simulated device. The [Modbus TCP plugin](https://github.com/kemptonburton/dartwic-modbus-tcp-client) uses the same structure with a network protocol; its register-specific details are not required to follow this guide.

# Configs

Keep the connection settings on the module. Keep the channel mappings on the tasks. Plugin-wide settings, such as discovery preferences, belong to the plugin. Use `bench_driver` as the plugin manifest ID for these examples.

```json
{
  "name": "bench",
  "plugin": "bench_driver",
  "module_type": "device",
  "parameters": {
    "endpoint": "192.168.1.20",
    "timeout_ms": 200,
    "event_system": "HARDWARE",
    "event_subsystem": "BENCH"
  }
}
```

A read task's arguments select the module and the values to publish:

```json
{
  "module_instance_name": "bench",
  "read_mappings": [
    {"field": "pressure", "channel": "bench.pressure"}
  ]
}
```

A write task's arguments select the values to send and where to report readback:

```json
{
  "module_instance_name": "bench",
  "write_mappings": [
    {"field": "valve", "channel": "bench.valve_command", "readback_channel": "bench.valve_state"}
  ]
}
```

The last two examples are **task arguments**, not complete task files. Task name, frequency, and other scheduling metadata sit outside `arguments`. Preserve unrelated and unknown fields when saving an existing resource.

# Module and factory

Wrap the device library in a small connection class. For this example, its interface is:

```cpp
// Driver code: implement these methods with your device's library.
class DeviceConnection {
public:
    DeviceConnection(std::string endpoint, int timeout_ms);
    ~DeviceConnection(); // Close the connection/library handle.
    double readValue(const std::string& field);
    void writeValue(const std::string& field, double value);
    bool probe(); // Ensure/recover the connection and check device responsiveness.
};
```

Make the module own that connection and its mutex:

```cpp
class DeviceModule final : public DARTWIC::Modules::BaseModule {
public:
    std::mutex mutex;
    DeviceConnection device;
    std::string instance_name;
    std::string connected_channel;
    std::string event_system;
    std::string event_subsystem;

    DeviceModule(nlohmann::json cfg, DARTWIC::API::SDK_API* api)
        : BaseModule(std::move(cfg), api),
          device(getParameter<std::string>("endpoint"),
                 getParameter<int>("timeout_ms", 200)),
          instance_name(getConfig<std::string>("name")),
          connected_channel(instance_name + ".connected"),
          event_system(getParameter<std::string>("event_system", "HARDWARE")),
          event_subsystem(getParameter<std::string>("event_subsystem", "DEVICE")) {
        // Startup/configuration work: prepare storage before the monitor loop runs.
        // Creating storage does not establish observe-only authority.
        api->createFixedChannel(connected_channel);
        api->upsertChannelField(connected_channel,
            DARTWIC::API::ChannelField::STALE_TIMEOUT, 3.0);
    }
    void monitorConnection(); // Defined in Connection Loop below.
};
```

`getParameter<T>` reads the module's `parameters`; `getConfig<T>` reads top-level metadata. Validate required endpoints and timeout bounds in your connection wrapper. These helpers can return defaults for malformed values, so a default alone is not validation.

The factory returns a module for the registered local type:

```cpp
DARTWIC::Modules::BaseModule* BenchDriverPlugin::createModule(
    const std::string& type, nlohmann::json cfg, DARTWIC::API::SDK_API* api) {
    if (type != "device") return nullptr;
    return new DeviceModule(std::move(cfg), api);
}

// In onPluginLoaded():
dartwic->registerModuleType({.id = "device", .name = "Bench device"});
```

Keep the starter's `createPlugin` and `dartwicEngineSdkAbiVersion` exports; see [Engine Plugin](Engine%20Plugin.md) for their definitions. A module should own one connection, not open a different connection for each linked task. A retained `shared_ptr` keeps the module alive; its mutex protects device access.

# Fixed channels and the repeated path

**Dynamic channels can appear as you publish values.** You do not need to create them in `on_configure`. Publish by name, and DARTWIC creates a missing channel when needed. This is convenient when channel names are discovered at runtime.

**Dynamic example — just read and publish:**

```cpp
using namespace DARTWIC::API;

// on_task: no separate channel-creation step is required.
const double pressure = device.readValue("pressure");
api->setChannel("bench.dynamic_pressure", ChannelValue{pressure});
```

A **fixed channel** uses a slot in RAPID's storage pool reserved when the Engine starts. Its value still changes normally. During configuration, `createFixedChannel` assigns that storage and returns a handle identifying the binding. Keep that handle in task state.

**Why use it? To make the task's repeated channel access more deterministic.** A hardware task usually reads/writes the same signals every cycle. Preparing their storage and bindings once moves that work into setup, avoids repeated name resolution, and keeps channel creation/storage allocation out of the repeated path. Use fixed handles for those known, frequently accessed signals; dynamic publication remains useful when that preparation is unnecessary or the channel names are not known ahead of time.

**Fixed example — prepare once, then reuse:**

```cpp
// on_configure: retain this handle in the task's runtime state.
const auto pressure_handle = api->createFixedChannel("bench.fixed_pressure");
// on_start: authority is separate from the choice of storage.
api->setChannel("bench.fixed_pressure");

// on_task: publish through the prepared binding, without resolving the name again.
const double pressure = device.readValue("pressure");
if (!api->upsertChannel(pressure_handle, pressure))
    throw std::runtime_error("Measurement publication was rejected.");
```

In the fixed example, configuration/startup run once; only `on_task` repeats. `createFixedChannel` creates fixed storage or promotes an existing dynamic channel, preserving existing values. Its optional initial value (zero by default) applies only to a new channel; it is not a device measurement. `setChannel` establishes observe-only authority. Later upserts update values without changing that authority.

Named calls can also address fixed channels; using a name does not change the channel's storage type. The read/write tasks below use retained fixed handles and prepare their mappings and buffers before repeated execution.

Handles belong to the current Engine. Reconfigure an invalid/retired binding rather than looking its name up again in the loop. Fixed access supports the prepared real-time path, but device I/O and synchronous reactions still count toward the callback's timing budget. See the [`createFixedChannel` reference](Reference/Engine/Channels/SDK_API-createFixedChannel.md) for storage and lifetime details.

# Read Task

The data flow is **device measurement → observe-only DARTWIC channel**. This short example includes the setup as well as the value movement. The comments show which lifecycle callback each part belongs to; retain the handle in task state between them. `device` is the module's connection wrapper:

```cpp
// on_configure: prepare the channel and retain its handle once.
const auto pressure_handle = api->createFixedChannel("bench.pressure");
// on_start: establish observe-only authority without publishing a fake sample.
api->setChannel("bench.pressure");

// on_task: read the device, then publish through the prepared handle.
const double pressure = device.readValue("pressure");
if (!api->upsertChannel(pressure_handle, pressure))
    throw std::runtime_error("Measurement publication was rejected.");
```

If the device reports `42.5`, this publishes `42.5` to `bench.pressure`, where graphs, calculations, and other tasks can read it. The startup `setChannel` establishes observe-only authority; the repeated upsert preserves it. This task gets its value from hardware—it does not tell the device what pressure to produce.

The read task below separates setup, authority establishment, and repeated work:

```cpp
using namespace DARTWIC::API;

struct ReadBinding {
    std::string field;
    std::string channel;
    FixedChannelHandle handle; // Prepared channel binding, reused every cycle.
};
struct ReadState {
    std::shared_ptr<DeviceModule> module;
    std::vector<ReadBinding> bindings;
    std::vector<double> values;
};

// Keep one TaskModuleBindings member on the plugin:
// TaskModuleBindings task_bindings_;
TaskTypeDefinition read;
read.metadata.structure = TaskStructure::Periodic;
read.metadata.default_arguments = {
    {"module_instance_name", ""}, {"read_mappings", nlohmann::json::array()}
};
task_bindings_.bind<DeviceModule>(read, dartwic, "bench_driver", "device", 1,
    [api = dartwic](const auto& module, TaskRuntime& runtime) {
        // Configuration path: parse mappings and prepare the entire runtime state.
        auto state = std::make_shared<ReadState>();
        state->module = module;
        const auto rows = taskArgument<nlohmann::json>(runtime, "read_mappings",
            nlohmann::json::array());
        if (!rows.is_array() || rows.empty()) throw std::runtime_error("Add a read mapping.");
        for (const auto& row : rows) {
            const auto field = row.at("field").get<std::string>();
            const auto channel = row.at("channel").get<std::string>();
            if (field.empty() || channel.empty()) throw std::runtime_error("Read mappings need a field and channel.");
            // Prepare storage once; preserve an existing channel's value/state.
            const auto handle = api->createFixedChannel(channel);
            state->bindings.push_back({field, channel, handle});
            api->upsertChannelField(channel, ChannelField::STALE_TIMEOUT, 1.0);
        }
        // Size the reusable device-read buffer before periodic execution begins.
        state->values.resize(state->bindings.size());
        runtime.setTypedRuntimeContext("bench_driver.read", state);
    });
read.on_start = [api = dartwic](const auto&, TaskRuntime& runtime) {
    const auto state = runtime.getTypedRuntimeContext<ReadState>("bench_driver.read");
    // Establish observe-only authority. No value argument means no fake sample.
    for (const auto& binding : state->bindings) api->setChannel(binding.channel);
};
read.on_task = [api = dartwic](const auto&, TaskRuntime& runtime, double) {
    // Repeated path: reuse the prepared module, mappings, handles, and buffers.
    const auto state = runtime.getTypedRuntimeContext<ReadState>("bench_driver.read");
    {
        std::scoped_lock lock(state->module->mutex);
        for (size_t i = 0; i < state->bindings.size(); ++i)
            state->values[i] = state->module->device.readValue(state->bindings[i].field);
    }
    // The device lock is released. Update values using the authority set on start.
    // upsertChannel(handle, ...) does not replace or renew that authority.
    for (size_t i = 0; i < state->bindings.size(); ++i)
        if (!api->upsertChannel(state->bindings[i].handle, state->values[i]))
            throw std::runtime_error("Measurement publication was rejected.");
};
dartwic->registerTaskType("read", "Device read", std::move(read));
```

This registration code belongs inside `onPluginLoaded()`. Include `<modules/TaskModuleBindings.h>` for the typed helpers. `taskArgument<T>` returns the fallback for an absent argument and throws for a malformed value. The binding helper resolves and retains the typed module during configuration, outside the repeated callback.

The `1` allows one configured read task per module. A write task has its own slot. Stopped configured tasks still occupy their slots; use `0` for no such limit. Failed preparation preserves the previous association, reconfiguration transfers it, and deletion releases it. Do not replace the configure/cleanup callbacks installed by `bind`.

`upsertChannel(handle, value)` publishes under the authority already established by `setChannel`; it does not acquire authority itself. That is why the loop uses **upsert after set**, rather than treating them as interchangeable calls. The SDK's `setChannel` overload accepts a name; `upsertChannel` supplies the retained- handle numeric write used here. If authority no longer permits the publication, the write fails instead of taking authority back.

A failed device read must not become a fresh zero measurement. Leave the last real value in place and expose failure/freshness through diagnostics or the channel's stale timeout. The sample uses a one-second stale timeout; choose one appropriate to your sample rate. It throws on read/publication failure; add task-specific diagnostics where your driver needs finer detail.

# Write Task

The data flow is **DARTWIC command channel → device output → separate readback channel**. Prepare both channel bindings once, but make only the readback observe-only. As in the read example, these lines represent separate lifecycle callbacks; the handles are retained in task state:

```cpp
// on_configure: prepare command input and readback output handles once.
const auto command_handle = api->createFixedChannel("bench.valve_command");
const auto readback_handle = api->createFixedChannel("bench.valve_state");
// on_start: this task publishes the readback, not the command input.
api->setChannel("bench.valve_state");

// on_task: consume the controller/operator's requested value.
// An unreadable handle returns the NaN fallback; reject it before device I/O.
const double command = api->queryChannel(command_handle,
    std::numeric_limits<double>::quiet_NaN());
if (!std::isfinite(command)) throw std::runtime_error("Command is unavailable.");

// Send the requested value, then read what the device actually reports.
device.writeValue("valve", command);
const double reported = device.readValue("valve");
// Publish that observed state using the prepared output handle.
if (!api->upsertChannel(readback_handle, reported))
    throw std::runtime_error("Readback publication was rejected.");
```

Do **not** call `setChannel` on the command input. The controller/operator owns that command. The driver consumes it; only its measurement/readback outputs are observe-only.

For example, a command of `1.0` causes the driver to send `1.0` to the device. If the device subsequently reports `0.0`, the readback channel receives `0.0`—the driver does not simply echo the requested value as confirmation. The meaning of those numbers comes from your device. The numeric check rejects NaN/infinity; freshness and device-specific limits need their own checks where required.

The full task below adds configuration, module linking, retained handles, reusable buffers, and connection locking, just as the read task did:

```cpp
struct WriteBinding {
    std::string field;
    std::string readback_channel;
    FixedChannelHandle command;  // Read another controller's command value.
    FixedChannelHandle readback; // Publish this driver's observed device state.
};
struct WriteState {
    std::shared_ptr<DeviceModule> module;
    std::vector<WriteBinding> bindings;
    std::vector<double> commands;
    std::vector<double> readbacks;
};

TaskTypeDefinition write;
write.metadata.structure = TaskStructure::Periodic;
write.metadata.default_arguments = {
    {"module_instance_name", ""}, {"write_mappings", nlohmann::json::array()}
};
task_bindings_.bind<DeviceModule>(write, dartwic, "bench_driver", "device", 1,
    [api = dartwic](const auto& module, TaskRuntime& runtime) {
        // Configuration path: bind inputs/outputs and allocate buffers once.
        auto state = std::make_shared<WriteState>();
        state->module = module;
        std::vector<std::string> command_names;
        const auto rows = taskArgument<nlohmann::json>(runtime, "write_mappings",
            nlohmann::json::array());
        if (!rows.is_array() || rows.empty()) throw std::runtime_error("Add a write mapping.");
        for (const auto& row : rows) {
            const auto field = row.at("field").get<std::string>();
            const auto command = row.at("channel").get<std::string>();
            const auto readback = row.value("readback_channel", command + "_state");
            if (field.empty() || command.empty() || readback.empty() || command == readback)
                throw std::runtime_error("Use a device field and separate command/readback channels.");
            // Preparing command storage does not take command authority.
            const auto command_handle = api->createFixedChannel(command);
            const auto readback_handle = api->createFixedChannel(readback);
            state->bindings.push_back({field, readback, command_handle, readback_handle});
            command_names.push_back(command);
            api->upsertChannelField(readback, ChannelField::STALE_TIMEOUT, 1.0);
        }
        // Declare prepared input dependencies; these remain owned by the controller.
        runtime.setFixedInputChannels(std::move(command_names));
        state->commands.resize(state->bindings.size());
        state->readbacks.resize(state->bindings.size());
        runtime.setTypedRuntimeContext("bench_driver.write", state);
    });
write.on_start = [api = dartwic](const auto&, TaskRuntime& runtime) {
    const auto state = runtime.getTypedRuntimeContext<WriteState>("bench_driver.write");
    // Only readback outputs become observe-only. Never set the command inputs.
    for (const auto& binding : state->bindings) api->setChannel(binding.readback_channel);
};
write.on_task = [api = dartwic](const auto&, TaskRuntime& runtime, double) {
    const auto state = runtime.getTypedRuntimeContext<WriteState>("bench_driver.write");
    // Repeated path: collect command values through retained input handles.
    for (size_t i = 0; i < state->bindings.size(); ++i) {
        const double value = api->queryChannel(state->bindings[i].command,
            std::numeric_limits<double>::quiet_NaN());
        if (!std::isfinite(value)) throw std::runtime_error("Command is unavailable.");
        state->commands[i] = value;
    }
    // Device I/O uses the same module connection/mutex as the read task.
    {
        std::scoped_lock lock(state->module->mutex);
        // Publish readbacks after device I/O; retain the observe-only authority.
    for (size_t i = 0; i < state->bindings.size(); ++i) {
            state->module->device.writeValue(state->bindings[i].field, state->commands[i]);
            state->readbacks[i] = state->module->device.readValue(state->bindings[i].field);
        }
    }
    for (size_t i = 0; i < state->bindings.size(); ++i)
        if (!api->upsertChannel(state->bindings[i].readback, state->readbacks[i]))
            throw std::runtime_error("Readback publication was rejected.");
};
dartwic->registerTaskType("write", "Device write", std::move(write));
```

`setFixedInputChannels` declares the task's command inputs for prepared binding; it does not set their values or take command authority. The repeated callback uses retained handles and reusable buffers, with no JSON parsing or module lookup. It releases the device mutex before publishing channel values.

A protocol readback reports what the device says, not necessarily what the physical mechanism did. Use a separate feedback sensor when that distinction matters. Adjust batching and readback frequency to your device rather than assuming one transaction per field is efficient. Timeouts and device response time still constrain the task rate.

# Connection Loop

Connection status should remain useful even when both tasks are stopped. Use one plugin loop to visit the configured modules and let each module manage its connection. Keep ARGUS reporting beside the connection check it describes:

```cpp
void DeviceModule::monitorConnection() {
    bool connected = false;
    std::string failure;
    try {
        std::scoped_lock lock(mutex);
        connected = device.probe();
    } catch (const std::exception& error) {
        failure = error.what();
    }
    dartwic->setChannel(connected_channel,
        DARTWIC::API::ChannelValue{connected ? 1.0 : 0.0});
    if (!connected) dartwic->recordEvent({
        {"type", "error"}, {"title", "Device connection unavailable"},
        {"description", failure.empty() ? "The device did not respond." : failure},
        {"system", event_system}, {"subsystem", event_subsystem},
        {"channels", {connected_channel}},
        {"correlation_key", "bench_driver:connection:" + instance_name},
        {"resolution", "Check device power, connection, and endpoint settings."},
        {"separation_seconds", 10.0}
    });
}

// In onPluginLoaded():
dartwic->registerLoop("connection_monitor", "Device connection monitor", {
    .on_loop = [api = dartwic]() {
        for (const auto& item : api->getModuleInstances("bench_driver")) {
            auto module = std::dynamic_pointer_cast<DeviceModule>(api->getModuleInstance(item.name));
            if (module) module->monitorConnection();
        }
    },
    .target_frequency_hz = 1.0,
});
```

The loop owns the observe-only connection channel and publishes a heartbeat each pass. `probe()` should use the configured timeout and bounded reconnect backoff; it should check device responsiveness, not merely whether a socket is open. Keep connection health separate from whether a particular read/write succeeded.

The stable ARGUS correlation key refreshes the same event. The finite quiet interval allows its firing condition to end after reports stop. Event admission is synchronous; recording and Interface delivery are separate asynchronous paths. An event describes the failure; it does not itself command a safe state. See [Events and Logs](../Engine/Events%20and%20Logs.md).

# Discovery Loop

Discovery finds devices that have not been configured and offers them for operator review. **Provisioning** turns an accepted offer into the module, channels, and tasks needed to use that device. It is optional and runs separately from configured devices' connection and read/write work.

The SDK provides a shared interface popup that you can use to present your recommended modules, tasks, and channels to an operator, this section shows how to do so.

![](_attachments/Pasted%20image%2020261025220337.png)

Keep discovery on a plugin-owned loop, with its scan and error reporting together:

```cpp
// Driver code: DeviceFinder implements bounded probing and setup offers.
auto finder = std::make_shared<DeviceFinder>(dartwic, config);
// Finder methods implement your settings validation and bounded-scan reconfiguration.
dartwic->registerOperation("get_discovery_settings", "Get discovery settings",
    [finder](const nlohmann::json&) { return finder->settings(); });
dartwic->registerOperation("configure_discovery", "Configure discovery",
    [finder](const nlohmann::json& values) { return finder->configure(values); });
dartwic->registerLoop("device_discovery", "Device discovery", {
    .on_loop = [api = dartwic, finder]() {
        try { finder->tick(); }
        catch (const std::exception& error) {
            api->recordEvent({
                {"type", "error"}, {"title", "Device discovery failed"},
                {"description", error.what()}, {"system", "HARDWARE"},
                {"subsystem", "DISCOVERY"},
                {"correlation_key", "bench_driver:discovery"},
                {"resolution", "Check discovery settings and device-library availability."},
                {"separation_seconds", 10.0}
            });
        }
    },
    .target_frequency_hz = 1.0,
});
```

The finder owns a small amount of discovery state: candidates awaiting probes, active setup-request IDs, presence recheck times, and mute handles. Bound each pass by a device/host budget and probe timeout. Discovery probes should identify devices without commanding their outputs.

For example, Modbus checks configured targets and bounded IPv4 ranges, using TCP probes before read-only register requests. A register response proves an address answered, not its sensor name, units, encoding, or write permissions. Its `address_response_only` confidence tells the operator to finish the mappings from the device register map. Include host, port, and any selected unit ID in the endpoint identity.

## Offer setup once per device

Give each physical endpoint a stable `discovery_id`, such as a serial number or a complete address. Use that same identity on every scan. The following code belongs inside your `DeviceFinder`; `candidate.id` and `candidate.endpoint` come from your device enumeration/probe code:

```cpp
const std::string id = candidate.id;
const std::string local_notification = "device-discovery:" + id;
const auto now_ms = std::chrono::duration_cast<std::chrono::milliseconds>(
    std::chrono::system_clock::now().time_since_epoch()).count();

// Check mute state and existing module configuration before announcing (below).
auto offer = api_->requestInterfaceUi("dartwic.module-discovery", {
    {"discovery_id", id}, {"device_type", "bench_device"},
    {"display_name", "Bench device"},
    {"endpoint", {{"identifier", candidate.endpoint}}},
    {"metadata", {{"endpoint_label", candidate.endpoint}}},
    // A lease lets the UI expire an offer if updates stop arriving.
    {"presence", {{"available", true}, {"valid_until_unix_ms", now_ms + 15000}}},
    {"provisioning", {
        {"module_type", "device"}, {"suggested_instance_name", "bench"},
        {"parameters", {{"endpoint", candidate.endpoint}, {"timeout_ms", 200}}},
        {"module_identity", {{"parameter_keys", {"endpoint"}}}},
        {"tasks", nlohmann::json::array()}
    }}
}, {
    {"request_key", id}, {"merge_key", "module-discovery"},
    {"silenceable", true}, {"mute_scope", "engine"},
    {"notification_id", "bench_driver:" + local_notification},
    {"reopen_completed", true}
});
const auto request_id = offer.value("request_id", std::string{});
if (request_id.empty()) throw std::runtime_error("Setup offer returned no request ID.");
request_ids_[id] = request_id; // Finder-owned map: endpoint ID -> request ID.
```

This offers a setup workflow; it does not immediately create a module or start I/O. The shared UI applies the operator's selected module, channels, and tasks.

`request_key` updates/deduplicates one endpoint's request. `merge_key` groups related offers into the shared discovery workflow. The stable `notification_id` identifies what the operator can mute. `mute_scope: "engine"` makes that mute shared by clients connected to this Engine, rather than a local popup preference. Use the same IDs for subsequent presence updates.

## Suggest channels and tasks together

Describe setup in the same offer so the operator can review the connection and its channel mappings together:

| Offer field | What to supply |
| --- | --- |
| `provisioning.module_type`, `provisioning.parameters` | Local module type and device connection settings. |
| `provisioning.module_identity.parameter_keys` | Parameters that identify an already configured endpoint. |
| `provisioning.tasks` | Suggested local task types, name suffixes, and base arguments. |
| `provisioning.channel_suggestion_editor` | Editable channel names and read/write mappings, using `explicit_mappings` or `address_ranges`. |

For each editor task, `argument_key` identifies the mapping array to replace, such as `read_mappings`. Its `arguments` add setup defaults while preserving the base task arguments. Address-range groups can supply `mapping` defaults, with task-option overrides and a `readback_suffix` for derived state channels. For example, a write option with `readback_suffix: "_state"` turns the suggested command `bench.valve` into a mapping with `channel: "bench.valve"` and `readback_channel: "bench.valve_state"`. The host also previews the state channel as an input. Renaming the command in discovery updates that derived name before provisioning; existing configured mappings are not renamed. Modbus supplies this suffix for both coil and holding-register write suggestions.

The plugin supplies the supported choices; the host builds the provisioning plan. Editing a suggested channel changes only the draft until Apply, and required channels stay selected. Keep mapping definitions in the offer rather than maintaining a second set in the Interface.

See the [example plugin's offer](https://github.com/kemptonburton/dartwic-example-plugin/blob/main/engine/src/example_device_discovery.cpp) for explicit mappings, or [Modbus discovery](https://github.com/kemptonburton/dartwic-modbus-tcp-client/blob/main/engine/src/modbus_device_discovery.cpp) for address ranges across coils, discrete inputs, holding registers, and input registers. The [Interface UI SDK](Reference/Engine/Interface%20UI%20and%20Notifications/Overview.md) documents the request APIs.

## Honor mute and unmute

Use the SDK's `NotificationMuteHandle` to poll notification preferences from the finder loop. Its callbacks run on that loop when `refresh()` observes a change, not on a transport thread:

```cpp
#include <notifications/NotificationMuteHandle.h>

// Members of your DeviceFinder:
std::map<std::string, DARTWIC::API::NotificationMuteHandle> mute_handles_;
std::map<std::string, std::string> request_ids_;

// Before probing/announcing this candidate:
auto [it, inserted] = mute_handles_.try_emplace(id, local_notification,
    [this, id] {
        withdrawOffer(id); // Publish available=false, then forget the active offer.
    },
    [this, id] {
        forgetOffer(id);   // Discard cached offer/presence bookkeeping.
        scheduleRescan();  // Make the next bounded scan eligible immediately.
    });
try {
    if (it->second.refresh(*api_)) return; // Muted: do not offer this endpoint.
} catch (...) {
    return; // Unknown preference state: defer the offer and try again next pass.
}
if (hasConfiguredModule(candidate)) return;
if (request_ids_.contains(id)) return; // Existing offers use presence updates instead.
// The setup offer above can now be sent for a freshly verified candidate.
```

`withdrawOffer`, `forgetOffer`, `scheduleRescan`, and `hasConfiguredModule` are methods you implement in the finder, as Modbus does. They are not extra SDK calls. A mute withdraws the offer; it must not stop an already configured module or its tasks. Unmute makes discovery eligible again, but the device still needs a fresh presence check.

The handle receives the **plugin-local** ID `device-discovery:<id>`. `isNotificationMuted`, used by the handle, qualifies it with the plugin ID; that matches the full `bench_driver:device-discovery:<id>` used in the offer. Do not add the plugin prefix twice when checking mute state.

Refresh **all retained mute handles** each finder pass, even when muted devices have been removed from the current probe queue:

```cpp
for (auto& [id, handle] : mute_handles_) {
    try { handle.refresh(*api_); }
    catch (...) { /* Retain state; per-candidate checks defer fresh offers. */ }
}
```

Otherwise a device removed from scanning because it was muted might never be noticed when the operator unmutes it. Keep callbacks from erasing the mute-handle map while that map is being iterated. They can invalidate separate offer/cache state and reset the probe queue.

## Refresh, withdraw, and reopen offers

Modbus rechecks announced endpoints periodically and renews a 15-second presence lease. Those are example timings; choose appropriate probe and lease intervals for your device. To refresh or withdraw a pending offer, update its existing payload with the same IDs:

```cpp
const auto request = api_->getInterfaceUiRequest(request_ids_.at(id));
if (request.value("status", "pending") == "pending") {
    auto payload = request.at("payload");
    payload["presence"] = {{"available", available},
        {"valid_until_unix_ms", available ? now_ms + 15000 : 0}};
    api_->requestInterfaceUi("dartwic.module-discovery", std::move(payload), {
        {"request_key", id}, {"merge_key", "module-discovery"},
        {"silenceable", true}, {"mute_scope", "engine"},
        {"notification_id", "bench_driver:device-discovery:" + id},
        {"reopen_completed", false} // A heartbeat must not reopen a finished dialog.
    });
}
```

Here `available` is the result of a fresh probe, and `now_ms` is current Unix time in milliseconds. On disappearance, mute, or successful configuration, withdraw the offer with `available=false` and remove its local request/presence bookkeeping. If a broker call fails, do not extend an unverified lease; the UI can expire the last one.

Closing/dismissing a dialog is different from muting it. `reopen_completed: true` on a **fresh announcement** permits reoffering an endpoint that is still present, unconfigured, and unmuted. It does not mean reopen it blindly every tick. Check actual module configuration each pass; a terminal request status alone is not proof that a device was configured, and a configured module may later be deleted. Retain the current offer on transient request-query errors to avoid duplicates.

A useful finder pass therefore refreshes mute preferences, reconciles request results with actual module configuration, rechecks announced devices, then spends its remaining probe budget on candidates. This is the pattern used by Modbus's `tick`, `isDiscoveryMuted`, and presence-update methods.

## Shared resource presentation

Use `DARTWIC::API::DiscoveryResources` from `<discovery/DiscoveryResources.h>` and its `toJson()` helper to preview resources created by initialization:

| Created by | Descriptor location |
| --- | --- |
| Module initialization | `provisioning.resources` |
| Suggested task initialization | That task editor descriptor's `resources` |

The helper contains `channels` (`name`, `label`, `direction`) and `loops` (`name`, `label`). Names can contain `{instance}`, replaced by the chosen module name. The shared UI shows fixed task resources beneath editable bindings. These descriptors explain what initialization creates; they do not create resources or change task arguments themselves.

Keep task-created channels on their task descriptor. Discovery and shared connection-monitor loops belong to the plugin, not each module instance.

## Verify the configured device

Accept an offer in the [example workspace](../Getting%20Started/Example%20Workspace.md), then inspect the module endpoint and each task's module selection and mappings. Start with reads and check expected values before enabling outputs. Successful provisioning establishes configuration creation; verify connection, task health, and device readings separately. Exercise disappearance/return, an already configured endpoint, mute/unmute, and cancellation.

# UI

Keep UI declarations in small files, then connect them in one registration file. The local IDs below match the native module/task IDs from the earlier sections. Config Map is optional: it views/edits existing configuration through adapters; it does not create a second set of settings or channel mappings.

## Module settings UI

Each module has a settings page that opens when the module is opened. It can look something like the image below, by using the shared Config Map.

![](_attachments/Pasted%20image%2020261025221001.png)

`interface/src/moduleMap.ts` describes the connection owned by the module:

```ts
import {defineConfigMap, createModuleConfigAdapter}
  from "@dartwic/interface-sdk/config-maps";

export const moduleMap = defineConfigMap({
  ...createModuleConfigAdapter(),
  groups: [
    {id: "connection", label: "Connection", fields: [
      {path: "parameters.endpoint", label: "Endpoint", type: "text", required: true},
      {path: "parameters.timeout_ms", label: "Timeout (ms)", type: "number",
        required: true, integer: true, min: 1, defaultValue: 200},
    ]},
    {id: "events", label: "Event attribution", fields: [
      {path: "parameters.event_system", label: "System", type: "text", defaultValue: "HARDWARE"},
      {path: "parameters.event_subsystem", label: "Subsystem", type: "text", defaultValue: "DEVICE"},
    ]},
  ],
});
```

The adapter reads the existing module file and uses its save/reload lifecycle, including linked-task rebinding. An accepted background request is not the end: it waits for the job and reads the resulting configuration.

## Shared task field

The task UIs shown below use the shared Config Map SDK and other shared module specific SDK APIs. The final task UIs can look something like the image below.

![](_attachments/Pasted%20image%2020261025221302.png)

`interface/src/taskFields.ts` holds the module selector used by both task UIs:

```ts
import type {ConfigMapField} from "@dartwic/interface-sdk/config-maps";

export const moduleConnection: ConfigMapField = {
  path: "arguments.module_instance_name", label: "Module", type: "module",
  pluginId: "bench_driver", moduleTypeIds: ["device"], required: true,
  maxTasksPerModule: 1,
};
```

The capacity hint matches the native binding helper's one-task-per-type limit. The Engine still validates the association. Omit the hint if your native driver does not impose that configured-task limit.



## Read task UI

`interface/src/readMap.ts` maps device fields to the channels the read task publishes:

```ts
import {defineConfigMap, createTaskConfigAdapter}
  from "@dartwic/interface-sdk/config-maps";
import {moduleConnection} from "./taskFields";

export const readMap = defineConfigMap({
  ...createTaskConfigAdapter(),
  groups: [
    {id: "connection", label: "Task configuration", fields: [moduleConnection]},
    {id: "bindings", label: "Read bindings", tables: [{
      path: "arguments.read_mappings", label: "Device measurements",
      createRow: () => ({}),
      columns: [
        {path: "field", label: "Device field", type: "text", required: true},
        {path: "channel", label: "Publish channel", type: "channel",
          channelMode: "write", required: true},
      ],
    }]},
  ],
});
```

`channelMode: "write"` means the driver publishes to RAPID. This table edits the same `read_mappings` array consumed by the native read task.

## Write task UI

`interface/src/writeMap.ts` separates command inputs from observed readbacks:

```ts
import {defineConfigMap, createTaskConfigAdapter}
  from "@dartwic/interface-sdk/config-maps";
import {moduleConnection} from "./taskFields";

export const writeMap = defineConfigMap({
  ...createTaskConfigAdapter(),
  groups: [
    {id: "connection", label: "Task configuration", fields: [moduleConnection]},
    {id: "bindings", label: "Write bindings", tables: [{
      path: "arguments.write_mappings", label: "Device outputs",
      createRow: () => ({}),
      columns: [
        {path: "field", label: "Device field", type: "text", required: true},
        {path: "channel", label: "Command channel", type: "channel",
          channelMode: "read", required: true},
        {path: "readback_channel", label: "State readback", type: "channel",
          channelMode: "write", required: true},
      ],
    }]},
  ],
});
```

The driver reads the command channel and writes the readback channel. Both task adapters use the existing task configuration/recovery path, preserving metadata and checking expected arguments before an update. Running/hold restoration belongs to the Engine.

## Plugin settings UI

Each plugin has a settings page that can be accessed from the interface settings. It can look something like the image below, by using the shared Config Map.

![](_attachments/Pasted%20image%2020261025221109.png)

Discovery preferences belong to plugin settings. The finder operations registered in Discovery Loop supply live observation and reconfiguration. In this example, `finder->settings()` returns `enabled` and `scan_interval_seconds`, and `finder->configure(values)` validates and merges supplied keys without restarting configured modules. You implement that policy in the finder.

First put response handling in `interface/src/configOperations.ts`:

```ts
export async function request(context: any, name: string, payload: any = {}) {
  const response = await context.operation(name, payload, 30000);
  if (!response || response.error)
    throw new Error(response?.payload?.error || `Failed: ${name}`);
  return response.payload;
}
```

Then `interface/src/settingsMap.ts` connects the settings table to the existing workspace override and live finder:

```ts
import {defineConfigMap} from "@dartwic/interface-sdk/config-maps";
import {createStorageClient} from "@dartwic/interface-sdk/storage";
import {request} from "./configOperations";

export const settingsMap = defineConfigMap({
  groups: [{id: "discovery", label: "Device discovery", fields: [
    {path: "discovery.enabled", label: "Enable discovery", type: "toggle"},
    {path: "discovery.scan_interval_seconds", label: "Scan interval (seconds)",
      type: "number", required: true, integer: true, min: 1},
  ]}],
  async load(context) {
    const storage = createStorageClient(context.operation);
    const saved = await storage.readEffectiveSettings();
    const discovery = await request(context, "bench_driver.get_discovery_settings");
    return {revision: saved.revision, discovery};
  },
  async apply(next, previous, context) {
    // Patch changed keys only; preserve other plugin/workspace settings.
    const patch = Object.fromEntries(Object.entries(next.discovery).filter(
      ([key, value]) => JSON.stringify(value) !== JSON.stringify(previous.discovery[key])));
    const storage = createStorageClient(context.operation);
    await storage.writeSettingsOverride("workspace", {
      plugins: {bench_driver: {device_discovery: patch}},
    }, {revision: previous.revision});
    try {
      await request(context, "bench_driver.configure_discovery", patch);
    } catch (error: any) {
      throw new Error(`Settings saved; live discovery update failed: ${error.message}`);
    }
    return settingsMap.load(context); // Observe what the finder actually accepted.
  },
});
```

`revision` is editing metadata from the existing settings API, not a new settings file. The finder supplies live values and defaults, so the Interface does not need to repeat the Engine's discovery defaults. A failure after persistence remains a failure until the live state is reconciled. Modbus uses this same persist-then-reconfigure pattern for its finder; it does not restart configured modules when discovery preferences change.

## Custom layout, with multiple maps

For example, `interface/src/ReadEditor.tsx` can put normal components between the read map's groups:

```tsx
import React from "@dartwic/interface-sdk/react";
import {ConfigMap} from "@dartwic/interface-sdk/config-maps";

function BindingHelp() {
  return <p>Choose the device field and the channel that receives its measurements.</p>;
}
export function ReadEditor() {
  return <div className="space-y-4">
    <p>Select the device connection.</p>
    <ConfigMap groupIds={["connection"]}/>
    <hr />
    <BindingHelp/>
    <ConfigMap groupIds={["bindings"]}/>
  </div>;
}
```

Both visible maps share one registered document, validation, draft session, and Apply. The explicit editor controls the layout. Use a field's `render` callback for a device-specific control that edits that same document. Completely custom `panel`, `editor`, and settings `component` contributions remain supported without Config Map. See [Interface Plugin](Interface%20Plugin.md#share-configuration-with-config-map).

## Registration

Finally, `interface/src/plugin.ts` connects the files to the plugin registrar. The local IDs must match the native types registered earlier:

```ts
import {definePlugin} from "@dartwic/interface-sdk";
import {moduleMap} from "./moduleMap";
import {readMap} from "./readMap";
import {writeMap} from "./writeMap";
import {settingsMap} from "./settingsMap";
import {ReadEditor} from "./ReadEditor";

export default definePlugin({
  id: "bench_driver", name: "Bench driver",
  register(registry) {
    registry.addModuleUi({id: "device", name: "Bench device", configMap: moduleMap,
      connection: ({instanceConfig}) => ({
        channel: `${instanceConfig.name}.connected`, connectedValue: 1,
        endpoint: instanceConfig.parameters.endpoint,
      }),
    });
    registry.addTaskUi({id: "read", name: "Device read",
      configMap: readMap, editor: ReadEditor});
    registry.addTaskUi({id: "write", name: "Device write", configMap: writeMap});
    registry.addSettingsPanel({id: "discovery", name: "Discovery", configMap: settingsMap});
  },
});
```

The read task uses the custom layout; the write task uses the automatic layout. Omit `editor: ReadEditor` to use the automatic read layout too. The starter's runtime entry registers this exported plugin definition with the host.

Module/task sheets stage changes until Apply. Plugin settings text saves on blur; standalone Config Map text commits on Enter. None of these registrations creates a second configuration store or replaces the native lifecycle/application rules.

# Package / verify

Start with one measurement and one output on a simulator or bench device. Verify the read channel is observe-only, the command channel remains under the intended controller, and readback is a separate observation. Then add more bindings.

Check reconnects with tasks running and stopped, freshness after failed reads, link-limit rejection, reassignment/deletion, failed reconfiguration, and restoration of running/hold state. Check discovery presence, mute/unmute, and cancellation. Make sure optional readbacks and unknown settings survive edits.

Measure transaction duration and missed cycles before increasing the task rate. Use a [task group](../Engine/Execution%20and%20Timing.md#task-groups) when read, control, and write need declared ordering. Stopping a task or releasing a channel does not itself send a safe value to the equipment.

Build with the starter's scripts and follow [Packaging and Installation](Packaging%20and%20Installation.md). Match the native platform/runtime and include the device library's required dependencies. Before publication, set minimum Engine/Interface versions for the capabilities your artifact actually uses, including Config Map and task-update recovery where required. The optional shared UI does not require an Engine SDK ABI change.
