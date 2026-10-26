---
summary: Follow Interface plugin registration, contributions, host APIs, and delivery.
updated: 2026-10-26T14:16
created: 2026-10-04T18:31
---


An Interface plugin adds operator tools inside DARTWIC: pages, task and module editors, schematic nodes, settings, or shared presentation helpers. It uses the host's React runtime and Engine connection. It can ship on its own or alongside an [Engine plugin](Engine%20Plugin.md).

Start from the [example plugin](Overview.md#start-from-the-example). The source paths below belong to **your plugin repository**, not DARTWIC's internal source. Enable the Interface side in `plugin.json` and keep its ID consistent with the definition. The [manifest guide](Packaging%20and%20Installation.md#manifest) explains enabled sides and minimum host versions.

# Configure the plugin

The root **`plugin.json`** is shared by the Engine and Interface sides. Keep its `id` equal to the ID passed to `definePlugin`. These examples enable both sides because the UI calls the Engine plugin's `echo` operation:

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

For an Interface-only plugin, set `contains_engine_plugin: false` and keep `contains_interface_plugin: true`. Declare the minimum Interface version that provides your SDK features; an Engine side also needs its minimum Engine version. The [manifest guide](Packaging%20and%20Installation.md#manifest) covers the full contract.

Keep the starter's package/build configuration and runtime entry. Views use the Interface's existing Engine session; they do not need a second connection configuration. Any plugin settings or module/task editors below work with their own [configuration scopes](Storage%20and%20Settings.md).

# Plugin definition and loading

The starter defines its contributions in `interface/src/plugin.jsx` using **`definePlugin({ register(registry) { ... } })`**. The host evaluates that `register` callback to find out what your plugin adds. Register components and definitions there; their runtime work happens when the host opens or uses them.

```text
Load bundle → registerPlugin(definition) → register(registry)
                                            └─ Register UI contributions
                                                 └─ Host mounts the views in use
```

| Starter file | Role |
| --- | --- |
| `interface/src/plugin.jsx` | Plugin identity and the `register(registry)` callback. |
| `interface/src/index.jsx` | Exports the definition for the starter's tooling. |
| `interface/src/runtime-entry.jsx` | Registers the built plugin with the host through the SDK runtime. |
| Other files under `interface/src/` | Your components, configuration maps, hooks, and helpers. |

Keep the starter's runtime wrapper. `definePlugin` describes a plugin; `registerPlugin` makes its definition available to the host. The [registration reference](Reference/Interface/Plugin%20Registration/Overview.md) and [runtime reference](Reference/Interface/Runtime/Overview.md) explain both.

# Choose a contribution

The [InterfacePluginRegistrar](Reference/Interface/Plugin%20Registration/InterfacePluginRegistrar.md) lists all current registration methods; the [Interface SDK reference](Reference/Interface/Overview.md) covers their definitions and options. These examples illustrate the main patterns rather than defining a fixed list of everything a plugin can do.

Put imports at file scope and `registry.add…` calls inside `register(registry)`. Choose the contributions your tool needs:

| Registry method | What it adds |
| --- | --- |
| `addResource` | A page or file-backed operator tool. |
| `addTaskUi` | A task card, configuration editor, or Config Map for a registered task type. |
| `addModuleUi` | A module icon, connection presentation, and configuration UI. |
| `addSchematicNode` | A schematic component and palette defaults. |
| `addSettingsPanel` | Plugin settings, with a custom component or Config Map. |
| `addPopupUi` | A named modal workflow responding to backend UI requests. |
| `addValueFormat` | Numeric display and editing selected through a channel's Units format. |

IDs are local to your plugin. Match module/task UI IDs to the native types they represent. Adding UI does not create the Engine implementation or start a task. You can define each contribution in its own file and import it into `plugin.jsx`; the filenames and layout are yours to choose.

## Resources

A resource is an operator page or file-backed tool. The host mounts its component when the resource opens.

For example, register an operator page in `interface/src/plugin.jsx`:

```jsx
import {definePlugin} from "@dartwic/interface-sdk";
import EchoPanel from "./EchoPanel.jsx";

export default definePlugin({
    id: "example_device_plugin",
    name: "Example Device Plugin",
    register(registry) {
        registry.addResource({
            id: "echo", name: "Echo", label: "Echo",
            type: "component", component: EchoPanel,
            show_in_resource_tabs: true,
        });
    },
});
```

`EchoPanel` is your component; the next sections show its Engine call and UI. Keep other starter registrations you still need when adding this one.

## Module editors

The starter's `moduleMap` describes the simulated module's configuration. It can supply an automatic editor without a custom React panel:

```jsx
import {moduleMap} from "./configMaps.mjs";

// Inside register(registry):
registry.addModuleUi({
    id: "example_device", name: "Example Device", configMap: moduleMap,
});
```

Match `example_device` to the Engine's local module type. Add `panel`, `icon`, or connection presentation when the module needs them.

## Task editors

Task UI attaches to a registered task type. This example uses the starter's read-task Config Map:

```jsx
import {readMap} from "./configMaps.mjs";

// Inside register(registry):
registry.addTaskUi({
    id: "example_read", name: "Device read", configMap: readMap,
});
```

A contribution can also supply a `card` or custom `editor`. The [driver guide](Building%20a%20Hardware%20Driver.md#ui) shows the map definitions.

## Schematic nodes

A schematic contribution registers a canvas component and its initial data. This small label needs no Engine connection:

```jsx
import React from "@dartwic/interface-sdk/react";

// Inside register(registry):
registry.addSchematicNode({
    id: "label", name: "Bench label",
    component: ({data}) => <div className="rounded border bg-card p-2">{data?.label}</div>,
    dataDefaults: {label: "Bench"},
    palette: {defaults: {width: 160, height: 48}},
});
```

Use the [schematic node reference](Reference/Interface/Schematic%20Nodes/Overview.md) for configuration components, sizing, and command actions.

## Settings panels

A settings contribution adds a panel under the plugin's settings. The starter's `settingsMap` reads and updates the existing plugin settings:

```jsx
import {settingsMap} from "./configMaps.mjs";

// Inside register(registry):
registry.addSettingsPanel({
    id: "general", name: "Example Settings", configMap: settingsMap,
});
```

Use `component` for a custom layout, optionally alongside `configMap`. [Storage and Settings](Storage%20and%20Settings.md) explains data ownership.

## Popup workflows

A popup contribution handles a named UI request from the backend. Import your workflow component and register the name the Engine will request:

```jsx
import {ReviewSetup} from "./ReviewSetup.jsx";

// Inside register(registry):
registry.addPopupUi({
    id: "review_setup", name: "Review setup", component: ReviewSetup,
});
```

`ReviewSetup` is a component you implement. It receives pending `requests` and `complete` / `dismiss` callbacks; the [popup contract](Reference/Interface/Plugin%20Registration/PopupUiDefinition.md) describes their arguments. An Engine plugin requests it with `requestInterfaceUi("example_device_plugin.review_setup", payload)`.

## Value formats

A value format changes how a numeric channel is displayed. This one shows one decimal place:

```jsx
// Inside register(registry):
registry.addValueFormat({
    id: "one_decimal", name: "One decimal place",
    format: (value) => value.toFixed(1),
});
```

Select it with `format=example_device_plugin.one_decimal` in the channel's Units field. The stored number is unchanged. The [value format reference](Reference/Interface/Plugin%20Registration/ValueFormatDefinition.md) also covers parsing and custom editors.

# Use the host SDK

## Use the existing connection

Inside your React components, import **`useDartwic`** and **`useDartwicChannelValues`** from `@dartwic/interface-sdk/hooks`. They expose the host's operations, subscription helpers, and live channel data. Use them instead of opening another Engine connection.

For example, a resource can read device channels, call an operation registered by your Engine plugin, and display the result. Balance subscriptions as views mount/unmount, handle operation errors, and distinguish stale or missing data. The [hooks reference](Reference/Interface/Hooks%20and%20Utilities/Overview.md) also covers navigation, client identity, and remote TEMPEST calls.

Create `interface/src/EchoPanel.jsx` to call the Engine example's `echo` operation through the existing connection:

```jsx
import React from "@dartwic/interface-sdk/react";
import {useDartwic} from "@dartwic/interface-sdk/hooks";
import {Button} from "@dartwic/interface-sdk/ui";

export default function EchoPanel({setIsLoaded}) {
    const {operation} = useDartwic();
    const [reply, setReply] = React.useState("");
    const [busy, setBusy] = React.useState(false);
    React.useEffect(() => { setIsLoaded?.(true); }, [setIsLoaded]);

    async function sendEcho() {
        setBusy(true);
        try {
            const response = await operation("example_device_plugin.echo", {message: "hello"});
            if (response.error) throw new Error(response.payload?.error || "Echo failed");
            setReply(response.payload.echo.message);
        } catch (error) {
            setReply(error.message);
        } finally {
            setBusy(false);
        }
    }

    return <section className="space-y-2 p-4">
        <Button disabled={busy} onClick={sendEcho}>Send echo</Button>
        <p role="status">{reply}</p>
    </section>;
}
```

This view needs the Engine side's `echo` operation loaded. An Interface-only plugin can use the same hook to call built-in Engine operations.

UI updates are asynchronous relative to the Engine. An accepted request does not establish device feedback or task lifecycle completion. Put scheduled control and condition reactions in Engine tasks or DCode.

## Build with DARTWIC controls

Use the SDK for host services and shared UI inside your registered components:

| Import | Use it for |
| --- | --- |
| `@dartwic/interface-sdk/react` | The host's React runtime. |
| `@dartwic/interface-sdk/ui` | [Buttons, forms, dialogs, tables, and other controls](Reference/Interface/UI%20Components/Overview.md). |
| `@dartwic/interface-sdk/ui/dartwic` | [Channel, task, and module controls](Reference/Interface/DARTWIC%20UI%20Components/Overview.md). |
| `@dartwic/interface-sdk/config-maps` | [Configuration documents, fields, tables, and adapters](Reference/Interface/Config%20Map/Overview.md). |
| `@dartwic/interface-sdk/storage` | [Settings, scoped files, and shared plugin data](Storage%20and%20Settings.md). |

The starter also uses relative imports into its bundled `interface/sdk/`. Both access the public SDK. Avoid private Interface imports or bundling another React runtime. Use the [Tailwind preset](Reference/Interface/Styling/dartwicTailwindPreset.md) and semantic colors for layouts that follow the Interface theme.

The button above is host-owned. You can compose the same resource with other SDK controls; for example, wrap it in a card and register `EchoCard` as the resource component:

```jsx
import React from "@dartwic/interface-sdk/react";
import {Card, CardHeader, CardTitle, CardContent} from "@dartwic/interface-sdk/ui";
import EchoPanel from "./EchoPanel.jsx";

export function EchoCard(props) {
    return <Card>
        <CardHeader><CardTitle>Plugin connection check</CardTitle></CardHeader>
        <CardContent><EchoPanel {...props} /></CardContent>
    </Card>;
}
```

### Show linked module tasks

Use [ModuleRuntimeOverview](Reference/Interface/DARTWIC%20UI%20Components/ModuleRuntimeOverview.md) for linked task status, controls, and mapped channels. Supply the module instance name and channel resolver; the host manages live subscriptions and its shared Start/Stop/Hold confirmation workflow. Target-rate editing stays in Tasks.

A minimal module panel can show linked task controls without custom subscription code:

```jsx
import React from "@dartwic/interface-sdk/react";
import {ModuleRuntimeOverview} from "@dartwic/interface-sdk/ui/dartwic";

export function ModulePanel({instanceConfig}) {
    return <ModuleRuntimeOverview instanceName={instanceConfig.name} />;
}
```

Register it as the module contribution's `panel`. Add `resolveTaskChannels` when you also want the overview to display that driver's mapped channels.

## Share configuration with Config Map

Config Map is an optional editor for existing configuration. It is particularly useful when settings describe how device addresses and channels connect. It does not create another configuration store, require a particular restart policy, or replace custom components.

### Declare one document and its adapter

```ts
import {
  defineConfigMap, createModuleConfigAdapter,
} from "@dartwic/interface-sdk/config-maps";

export const connectionMap = defineConfigMap({
  ...createModuleConfigAdapter(),
  groups: [
    {id: "connection", label: "Connection", fields: [
      {path: "parameters.server_ip", label: "Address", type: "text", required: true},
      {path: "parameters.server_port", label: "Port", type: "number",
        integer: true, min: 1, max: 65535, defaultValue: 502},
    ]},
    {id: "events", label: "Event attribution", fields: [
      {path: "parameters.event_system", label: "System", type: "text"},
      {path: "parameters.event_subsystem", label: "Subsystem", type: "text"},
    ]},
  ],
});

// Inside register(registry):
registry.addModuleUi({id: "tcp_client", name: "TCP client", configMap: connectionMap});
```

This produces the shared module editor and exposes the same fields in Channel Search's Config Map. No React editor is required. `createModuleConfigAdapter()` reads the existing module JSON, uses the detached save/reload job, waits for its terminal result, and reads back the accepted document. `createTaskConfigAdapter()` uses the existing task-update/recovery path with an expected-arguments check, preserves metadata, and reads the resulting task. Engine code owns running and hold-state restoration. These helpers perform asynchronous configuration I/O; they are unrelated to periodic device execution.

Supply your own asynchronous `load(context)` and `apply(next, previous, context)` instead when the resource already has a different application API. `load` returns the full existing document. `apply` saves through that API and resolves after its application policy completes; return the accepted document, or omit the return value to accept `next`. Reject with an actionable error when saving or application fails. A saved file or admitted background job alone is not application success. Keep revision checks and device-specific decisions in this adapter.

Contexts contain `operation` plus the resource identity: `module.name`, `task.name`, or `plugin.id`. Resolve current configuration through the API rather than treating the identity summary as another saved document.

### Mix components and multiple maps

An explicit `panel`, task `editor`, or settings `component` owns the contents of that resource editor. Register `configMap` alongside it to keep its fields searchable in Config Map. Inside that custom component, the host supplies the registered definition, resource identity, and editor save behavior:

```tsx
import React from "@dartwic/interface-sdk/react";
import {ConfigMap} from "@dartwic/interface-sdk/config-maps";

function ConnectionHelp() {
  return <p>Use the endpoint from your device configuration.</p>;
}
function DiagnosticTools() {
  return <p>Custom diagnostics, scan controls, or visualizations go here.</p>;
}
function DevicePanel() {
  return <div className="space-y-4">
    <ConnectionHelp />
    <ConfigMap groupIds={["connection"]} />
    <hr />
    <DiagnosticTools />
    <ConfigMap groupIds={["events"]} />
  </div>;
}

registry.addModuleUi({
  id: "tcp_client", name: "TCP client",
  configMap: connectionMap, panel: DevicePanel,
});
```

These are two visible maps over **one document, one draft session, and one save queue**. `groupIds` changes rendering only; validation and Apply still cover the full registered definition. Do not create independent definitions or resource keys for different sections of the same file. The example plugin's task editor uses this pattern for task settings and channel bindings. EtherCAT keeps its adapter and PDO search controls as custom cells.

For a standalone map outside a registered editor, supply `definition`, `context`, and `resourceKey` explicitly. Use `module:<name>`, `task:<name>`, or `plugin:<plugin-id>:<local-settings-panel-id>` consistently across views. Genuinely independent configuration documents can use their own definitions and keys.

Config Map remains optional. Register only `panel`, `editor`, or `component` for a completely custom experience. A plugin can mix custom-only and map-backed contributions. Custom actions keep their own application logic; the host's Apply button applies registered map fields, not arbitrary component state. If a custom control edits a field in the same document, declare that field and supply its `render` callback so it participates in the same draft and validation path.

### Choose fields and binding tables

Fields support text, numbers, selections, toggles, module selectors, and searchable channel inputs. A dot-separated `path` addresses the existing document. Use `placeholder`, numeric bounds, `required`, `parse`, and synchronous `validate` callbacks for local feedback. The Engine remains authoritative. `defaultValue` may be a pure `(document, row)` function when the native driver derives a missing value, such as an output's `<command>_state` readback channel. This also keeps the derived channel visible in search and ownership traces.

```ts
import {defineConfigMap, createTaskConfigAdapter} from "@dartwic/interface-sdk/config-maps";

const readMap = defineConfigMap({
  ...createTaskConfigAdapter(),
  groups: [{id: "read", label: "Read task", fields: [
    {path: "arguments.module_instance_name", label: "Connection", type: "module",
      required: true, pluginId: "driver", moduleTypeIds: ["tcp_client"],
      maxTasksPerModule: 1},
  ], tables: [{path: "arguments.read_mappings", label: "Input registers",
    createRow: () => ({register_type: "input_register"}),
    columns: [
      {path: "register", label: "Address", type: "number", integer: true,
        min: 0, max: 65535, required: true},
      {path: "channel", label: "Publish channel", type: "channel",
        channelMode: "write", required: true},
    ],
  }]}],
});
```

`channelMode: "write"` means the driver publishes to RAPID; `"read"` means it consumes a RAPID command. For mixed-direction tables, a function `(document, row) => "read" | "write"` can choose per row. `maxTasksPerModule` is a selector hint for a native configured-task limit. Omit it or use zero when there is no such limit; a limit on running tasks is different.

A custom cell's `render` callback receives `value`, `draft`, `path`, the draft `document`/`row`, `context`, and `disabled`. Call `onDraft` for text editing and `onCommit` for explicit acceptance. For a structured picker, `onDraftAt(path, value)` can stage related **declared** fields in the same document. `hidden` fields keep picker metadata validated and searchable without displaying a separate column. These callbacks retain host drafts rather than creating another save path. Return a React component from `render`; put hooks inside that component.

### Save behavior and failures

| Presentation | Commit behavior |
| --- | --- |
| Module/task editor or Channel Search sheet | Stage changes until **Apply**; **Cancel** discards drafts. |
| Plugin settings page | Text/numbers save on blur; Enter leaves the input. Dropdowns/toggles save immediately. |
| Standalone Config Map | Enter commits text/numbers; dropdowns/toggles commit immediately. Blur/Tab leave text drafts. |

Escape restores the current cell. New bindings remain drafts until required values are valid. Shared views use the same session, so unfinished text is not accidentally saved by committing a different field. Saves serialize, newer edits remain editable, and failed application stays failed with a retry path. Retry first observes actual state because a timed-out request might have applied.

The host preserves undeclared fields in its document snapshots. Adapters must also preserve unknown fields and merge settings patches rather than replacing unrelated values. Drafts last only for the connected session; they are not another persistent store. Plugin settings still control their own lifecycle: Modbus updates its discovery finder without restarting configured modules.

Use a host release providing these Config Map capabilities. Before publishing a plugin that requires them, set its minimum Interface version to the first release that supplies them; raise its minimum Engine version only for Engine capabilities it actually requires. Existing custom components and `TaskBindingTable` remain supported.


# Build and inspect

Follow [Packaging and Installation](Packaging%20and%20Installation.md) for build commands, output layout, installing locally, and publishing. Build with the SDK matching your target host and declare the minimum versions your features need.

An in-app install/update loads the new UI bundle without an Engine restart; a manual file copy requires an Interface reload. Check the plugin's loaded status and open each contribution you registered. If nothing appears, check the manifest's Interface flag, matching IDs, runtime registration, and generated `ui/index.js`. [Plugins](../Interface/Plugins.md) explains load errors.

# Reference

The [Interface SDK reference](Reference/Interface/Overview.md) contains the full API. For a complete module/task configuration example, follow [Building a Hardware Driver](Building%20a%20Hardware%20Driver.md#ui).
