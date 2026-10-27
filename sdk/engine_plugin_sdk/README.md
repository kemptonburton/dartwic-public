# Engine Plugin SDK

Custom links use `registerPeerTransport` from `sdk_api.h`: supply a Transport factory and the Engine supplies the standard DARTWIC Peer and EngineProtocol. Device integrations use `registerPeer`: the factory receives an Engine-owned representative Peer and EngineProtocol for mapping device commands and telemetry. Both appear as connection types in Network Map.

Public engine plugin files live in `include/`.

Use:
- `plugins/BasePlugin.h` for the engine plugin root object.
- `modules/BaseModule.h` for repeatable module instances exposed by a plugin.
- `sdk_api.h` for runtime work and module, peer, task, function, operation, and loop registration.

Engine plugins are loaded once from `plugins/<plugin-id>/plugin.json`.
The plugin manifest shape is `id`, `name`, `version`, `minEngineVersion`, and `contains_engine_plugin: true`.
Side-only engine plugins set `contains_interface_plugin: false`.
The engine binary also requires `dartwicEngineSdkAbiVersion()` to return
`ENGINE_PLUGIN_SDK_ABI_VERSION` from `plugins/BasePlugin.h` before calling the
plugin factory. Rebuild the plugin against the matching SDK when this version
changes. The provided `src/starter_plugin.cpp` exports the function.

Override `onPluginLoaded()` and register modules, tasks, DCode functions, operations, and loops through `dartwic`. Registration IDs are local; the host exposes `<plugin-id>.<local-id>` names. Registration is transactional: an exception rejects the plugin before any staged registration becomes live.

DCode handlers run synchronously. The ordinary handler receives mutable JSON; the optional prepared handler receives mutable fixed-shape argument views and a caller-owned result writer. Mutations to existing argument values are visible through DCode aliases after return. Keep declared types, list lengths, and dictionary keys stable, and do not retain prepared views or writers after the call. Rebuild the plugin when the Engine SDK ABI changes.
Module instances are stored separately under `modules/` as JSON files.
Module type display metadata should stay in `module_config.json`; default parameter values should stay in `default_parameters.json`.

For a task that intentionally waits inside its callback, call `definition.setDisableWarnings()` before `registerTaskType`. This sets the `disable_warnings` default for the task type. A task instance can override it with `arguments["disable_warnings"]`. Scheduling and measured timing, missed cycles, and callback errors remain active.

## Named interface workflows

Engine plugins can open a host-owned or interface-plugin-owned workflow without blocking a Caesar loop:

```cpp
const auto request = dartwic->requestInterfaceUi(
    "dartwic.module-discovery",
    discovered_module,
    {{"request_key", stable_device_id}, {"merge_key", "module-discovery"}});
const auto request_id = request.at("request_id").get<std::string>();
```

Requests with the same UI and merge key share one notification and modal. `request_key` makes repeated detector passes idempotent. Query `getInterfaceUiRequest(request_id)` for `pending`, `completed`, `dismissed`, or `cancelled`; a completed request contains the JSON result declared by that UI. Plugin-local UI IDs are automatically exposed as `<plugin-id>.<ui-id>`; fully-qualified host IDs such as `dartwic.module-discovery` are used unchanged.

Set `silenceable: true` in the request options when the resulting interface notification may be muted. `mute_scope` is either `client` (the default, stored by that interface) or `engine` (shared by every connected interface and stored in the workspace root `settings.json`). Engine-scoped notifications must also provide a stable, entity-specific `notification_id`; do not reuse one ID for several actionable entities. The request record exposes its current `muted` state, and `isNotificationMuted(local_id)` lets a plugin avoid work before attempting a connection. Engine mute rules expire after 30 days without being touched and are capped by the host.

The built-in `dartwic.module-discovery` workflow is special only in its host-provided UI and Create action: it turns the user's selections into a module/task plan and asks the engine to provision that plan in one protected configuration operation. The discovery loop remains non-blocking and does not create the module itself. Its completed result contains `outcome`, `creation_plan`, `module_instance`, `tasks`, and `binding_impact`.

Use `notifications/NotificationMuteHandle.h` to attach plugin-owned on-mute and on-unmute callbacks without adding SDK virtual methods. Keep a handle per notification and call `refresh(*dartwic)` on the plugin loop. It reads persisted engine state, invokes callbacks once per transition on that same loop, and returns whether the notification is muted. An initially persisted mute invokes the on-mute callback. A failed lookup throws; defer discovery until a later successful lookup.

The plugin owns discovery policy: check mute state before network probes and again before publishing, check live module identity before offering an existing endpoint, and retain the returned request ID to avoid repeating a pending request. The framework owns persistence, notification rendering, the built-in discovery UI, and provisioning. The interface's `onMuted`/`onUnmuted` handlers persist the preference; plugin callbacks observe that preference on the next loop pass.

For example, pair a handle with local ID `device-discovery:<endpoint>` with request options `silenceable: true`, `mute_scope: "engine"`, and `notification_id: "<plugin-id>:device-discovery:<endpoint>"`. The request ID and notification ID are distinct: one identifies a workflow, the other identifies the durable mute preference. Only set `reopen_completed: true` after the plugin has checked that the device is no longer configured and is not muted.

Reusable media, models and plugin assets use `workspace/assets/<namespace>/<filename>`. Use your plugin ID as the namespace. The SDK exposes `workspaceAssetPath(...)`, `readWorkspaceAsset(node, namespace, filename)` and `saveWorkspaceAsset(node, namespace, filename, content)` through the existing TEMPEST operations. Store UTF-8 text or JSON with base64 binary payloads, and retain the returned portable reference in configuration. See [Workspace Assets](../../docs/Website/docs/Plugins/Storage%20and%20Settings.md).

Create fixed channels during configuration with `createFixedChannel`; the initial value defaults to zero:

```cpp
dartwic->createFixedChannel("device.temperature", 20.0);
dartwic->upsertChannelField(
    "device.temperature",
    DARTWIC::API::ChannelField::STARTUP_VALUE,
    DARTWIC::API::StartupValue{true, 0.0},
    DARTWIC::API::ChannelStorage::Fixed);
```

Once created, use the ordinary `queryChannelField` and `upsertChannelField` APIs. Fixed channels are retired by removing or reconfiguring their declaring task or module; a direct `removeChannel` call cannot delete one.
Setting `STARTUP_VALUE` configures the next engine start; it does not immediately write the live channel.

## Channel references in Project

Project automatically finds fixed declarations, registered task arguments and metadata, channel calculations, project files, and live channel origins. Plugin authors do not need to register these common cases. For a channel use held only in private plugin memory, register one optional source during `onPluginLoaded`:

```cpp
dartwic->registerChannelReferenceSource("profiles", [this](DARTWIC::API::ChannelReferenceSink& refs) {
    for (const auto& profile : profiles_) {
        refs.addOwner(profile.output_channel, "valve_profile", profile.name, "publishes");
        refs.addExact(profile.input_channel, "valve_profile", profile.name,
            "/input_channel", "reads", "Rebind valve profile",
            "my_plugin.rebind_profile", {{"profile", profile.name}});
        refs.scanJson("valve_profile", profile.name, profile.settings);
    }
});
```

The callback runs on demand for a Project audit, outside the task loop. `addOwner` reports channels currently owned by the plugin, and `addExact` reports uses; both filter to channels in that audit. `scanJson` finds exact names and marks template matches as possible references. If private state cannot be read safely, call `refs.markIncomplete("reason")`. An incomplete scan excludes affected channels from Channel Cleanup. The optional operation must belong to the registering plugin; Project can offer it as a follow-up action. The engine unregisters this source before unloading the plugin.

The final optional argument to `addExact` and `addOwner` is a JSON change description. A plugin can say why a private binding cannot be renamed, for example `{{"rename", "non_editable"}, {"reason", "Channel name is compiled into the device profile."}}`. Project shows that resource and reason in the action preview. A `required_action` and registered operation can guide a manual follow-up; a plugin operation is not run implicitly during a channel rename. Only the engine's verified source and configuration adapters advertise automatic edits.

This SDK contains the DARTWIC-owned files plugin authors should not edit:
- `plugin.json`
- `src/starter_plugin.cpp`
- `include/starter_plugin.h`

## Storage and settings

`SDK_API` provides optional root/path helpers, `readStorageJson`/`writeStorageJson`,
and workspace/project settings with inheritance, reset pointers and revision checks.
Keep module parameters in project resources, credentials in instance settings,
recordings in runtime, and regenerable output in cache. The hand-written
[Storage and Settings guide](../../docs/Website/docs/Plugins/Storage%20and%20Settings.md)
includes the scope inventory and module, plugin and shared-asset examples.

## Discovery presence leases

Module discovery is a live offer, not a permanent inventory entry. Plugins may
include `presence: {available: true, valid_until_unix_ms: <UTC epoch milliseconds>}`
in the `dartwic.module-discovery` request payload. Renew it only after successfully
verifying the device's protocol response. Refresh the existing stable request key;
do not create a new notification identity for each check. Set `available: false`
to withdraw an offer after a failed check, configuration change, or mute.

The discovery UI removes withdrawn or expired offers, including after missed
telemetry, and checks the current request before provisioning. A mute preference
can outlive the offer; it is not evidence that the device is still online. Muted
plugins need not keep probing: withdraw availability, preserve the mute, and only
offer the device again after unmute and a fresh successful scan. Older plugins
without a presence declaration retain their existing behavior.
