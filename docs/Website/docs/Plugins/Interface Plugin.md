---
summary: Add an operator resource using the host React runtime and registry.
updated: 2026-10-20T23:10
created: 2026-10-04T18:31
---

An interface plugin runs inside the DARTWIC interface. It uses the host's React runtime and SDK to add views; it does not create a separate application or engine connection.

Start from the [example plugin](Overview.md). For UI only, set `contains_engine_plugin` to `false` and `contains_interface_plugin` to `true` in `plugin.json`. Keep `minInterfaceVersion` and the bundled SDK aligned with your target host.

## 1. Add a resource

Replace `interface/src/plugin.jsx` with a small resource. This example uses the starter's unchanged ID:

```jsx
import React from "../sdk/react.ts";
import { definePlugin } from "../sdk/index.ts";

function TestNotes() {
    return (
        <section className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">Test notes</h2>
            <p>Select a run and record your observations here.</p>
        </section>
    );
}

export default definePlugin({
    id: "example_device_plugin",
    name: "Example Device Plugin",
    register(registry) {
        registry.addResource({
            id: "test_notes",
            name: "Test Notes",
            label: "Test Notes",
            type: "component",
            component: TestNotes,
            show_in_resource_tabs: true,
        });
    },
});
```

The starter's `interface/src/index.jsx` exports this definition. Its build entry registers the bundle with the host. Keep that wrapper: placing arbitrary React output in `ui/index.js` does not register a plugin.

Import React and UI helpers from the bundled SDK, as the example does. Bundling another React runtime or importing private interface source can break hooks and compatibility.

## 2. Build and inspect

```sh
npm ci
npm run build
npm run verify
npm run package
```

The built entry is `plugin/interface/example_device_plugin/ui/index.js`. Install it using [Packaging and Installation](Packaging%20and%20Installation.md), reload the interface, and look for **Test Notes** in the resource navigation.

## Choose a contribution

| Registry method | Use it for | Example source |
| --- | --- | --- |
| `addResource` | A page or file-backed tool. | `resourcesAndSchematics.jsx` |
| `addTaskUi` | A compact task card and configuration editor. | `taskCards.jsx`, `taskConfigs.jsx` |
| `addModuleUi` | A module icon and parameter editor. | `moduleConfigs.jsx` |
| `addSchematicNode` | A node component and palette defaults. | `resourcesAndSchematics.jsx` |
| `addSettingsPanel` | Plugin settings. | `pluginSettings.jsx` |

Contribution IDs are local to the plugin. Match a task or module UI ID to the engine registration it represents. Task cards display and command runtime state; configuration editors modify task configuration through the host bridge.

## Use the existing connection

The SDK's [useDartwic](Reference/Interface/Hooks%20and%20Utilities/useDartwic.md) exposes the host connection. Use its operations and subscription helpers instead of constructing another client. Balance channel subscriptions when a component mounts and unmounts, handle operation errors, and show stale or missing values explicitly.

A React render or telemetry handler runs asynchronously relative to the engine. Put timing-sensitive calculations and event reactions in [DCode](../DCode/Overview.md) or a native engine implementation.

## Build with DARTWIC controls

Import controls from `@dartwic/interface-sdk/ui` (or the starter's bundled
`../sdk/ui/general.ts`). The SDK uses host-owned components, including buttons,
forms, cards, tables, dialogs, menus, popovers, and loading states. Combine them
with the DARTWIC-specific channel, task, and module controls from
`@dartwic/interface-sdk/ui/dartwic`. The [UI component reference](Reference/Interface/UI%20Components/Overview.md)
lists the supported exports and their props.

```jsx
import React from "@dartwic/interface-sdk/react";
import {Button, Card, CardContent, CardHeader, CardTitle} from "@dartwic/interface-sdk/ui";

export function DevicePanel() {
    return <Card>
        <CardHeader><CardTitle>Device</CardTitle></CardHeader>
        <CardContent><Button variant="outline">Refresh</Button></CardContent>
    </Card>;
}
```

Use the [Tailwind preset](Reference/Interface/Styling/dartwicTailwindPreset.md)
and semantic classes such as `bg-card`, `text-foreground`, and `border-border`
for plugin-owned layout. Their colors follow the current interface appearance.
Compile any plugin-specific classes into the plugin bundle. Do not import GUI
source files or bundle a separate React runtime. The example plugin shows a
resource, settings form, task editor, and module panel built with SDK controls.

The expanded control catalog is part of Interface 2.0.0. Set
`minInterfaceVersion` accordingly when building against this SDK snapshot;
the host reports a compatibility error before loading a plugin that requires a
newer interface.

## Show linked module tasks

Use `ModuleRuntimeOverview` from `@dartwic/interface-sdk/ui/dartwic` on a module
page. Provide `instanceName`, an optional `taskTypeIds` allowlist, and
`resolveTaskChannels(task)` for the mapped channels. The host finds linked tasks,
subscribes to their live state, and releases those subscriptions when the view closes.

Each task includes Start, Stop, and Hold buttons with green, red and yellow states.
Click a button once to arm it, then click its check mark to confirm. Arming expires
after four seconds and clears on Escape, clicking away, changing focus outside
the controls, or a change in task state or control permissions.
Hold toggles to release hold;
Start and Stop clear hold before updating running, using the same control channels
as the Tasks resource. A single read-only measured frequency or worker rate follows
the buttons, using the same compact formatter as browser loops, such as `10Hz`.
Worker rates also use Hz, including `0Hz`.
Target-rate editing remains in the Tasks resource.

Controls are disabled for viewers, disconnected sessions, and rebuilding tasks.
Writes run asynchronously through the existing engine connection, with no automatic
retry. Errors appear beside the controls; accepted requests do not establish that
a lifecycle handler has completed or equipment has responded. Status comes from
live telemetry. Existing plugins using this host helper gain these controls without
adding plugin-specific UI or rebuilding their bundles.

## Reference

The [Interface SDK reference](Reference/Interface/Overview.md) contains the complete contribution types. Start with [plugin registration](Reference/Interface/Plugin%20Registration/Overview.md), [resources](Reference/Interface/Resources/Overview.md), [tasks](Reference/Interface/Tasks/Overview.md), or [schematic nodes](Reference/Interface/Schematic%20Nodes/Overview.md).

If the plugin is installed but no view appears, check that the manifest enables the interface side, the IDs match, `ui/index.js` exists, and the definition uses the current `definePlugin({ register })` contract.
