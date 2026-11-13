---
title: Schematic Nodes
created: 2026-11-12T15:51
updated: 2026-11-13T00:26
---

An Interface plugin can add a preset built from General Node or provide a custom renderer. Both appear in the node browser and Node Gallery. Presets with channel-binding support also appear in Insert Node and accept channels dropped onto existing instances.

## Add a preset to the gallery

Use `addSchematicNodePreset` inside the plugin's `register` callback. A preset is saved node data, not another renderer. This example uses the built-in readout, including its normal configuration tabs:

```ts
registry.addSchematicNodePreset({
    id: "pressure", name: "Pressure", category: "readouts",
    node: {
        type: "general",
        data: {general_settings: {
            content: "readout", body_style: "card", body_shape: "rectangle",
            readout: {type: "gauge", title: "PRESSURE", units: "psi", min: 0, max: 1000, show_ticks: true},
        }},
    },
});
```

The method returns a plugin-qualified identity such as `my_plugin.pressure`. Local contribution IDs must be unique within their registration category. Category IDs are `readouts`, `controls`, `fluids`, `layout`, and `media_views`; custom category names are supported too. Browser, Insert Node and gallery use the same catalog.

Registration is synchronous and changes the loaded Interface contribution inventory. It does not create a canvas instance, write channel values, or write workspace files. New placements copy the preset's data. Changing a plugin preset does not overwrite existing placements. Plugin assets belong in the plugin's `assets/`; shared authored preset files remain in workspace `assets/schematic_nodes/`.

## Use the shared node backend

Use `BaseNode` for a custom center and `BaseNodeConfig` for the standard Node Setup and Node Appearance tabs. Dedicated content belongs in additional sections. The host owns labels, handles, inspection, rotation, size and alerts; the custom component owns its center content.

```jsx
import React from "@dartwic/interface-sdk/react";
import {BaseNode, BaseNodeConfig, NodeSettingsSection, NodeSettingsField}
    from "@dartwic/interface-sdk/schematic-nodes";
import {Input} from "@dartwic/interface-sdk/ui";

function BenchNode(props) {
    return <BaseNode {...props}>
        <div className="rounded border border-schematic-node-outline bg-schematic-node-background-1 p-2">
            {props.data.caption}
        </div>
    </BaseNode>;
}

function BenchConfig(props) {
    const node = props.nodes[0];
    return <BaseNodeConfig {...props} sections={[{
        title: "Bench Setup", value: "bench",
        content: <NodeSettingsSection title="Display">
            <NodeSettingsField label="Caption" settingPath="data.caption">
                <Input value={node.data.caption ?? ""} onChange={event =>
                    props.updateNodes(props.nodes, {data: {...node.data, caption: event.target.value}})} />
            </NodeSettingsField>
        </NodeSettingsSection>,
    }]} />;
}

// Inside register(registry):
const type = registry.addSchematicNode({
    id: "bench", name: "Bench Display",
    component: BenchNode, configComponent: BenchConfig, configIncludesBase: true,
    propDefaults: {width: 160, height: 60},
    dataDefaults: {caption: "BENCH", connection_ports: [
        {id: "inlet", label: "Left point", x: 0, y: 0.5, side: "left"},
    ], fluid_port_roles: {inlet: "sink"}},
    palette: {category: "readouts"},
});
```

Renderer props include `id`, `type`, `data`, `width`, `height`, and `selected`. Editors receive `nodes` and `updateNodes(nodes, patch)`. The patch modifies node records, so saved data belongs under `data`. A functional patch can compute changes for each node independently. Declare `settingPath` on each `NodeSettingsField` or `NodeSettingsToggle` to participate in shared-selection editing, mixed values and field-specific applicability. Keep custom data under stable paths and preserve unrelated fields.

Set `configIncludesBase: true` when your editor already renders the shared editor. Otherwise the host supplies the standard tabs and places your editor in Node Settings. Omitting a custom editor still provides shared setup and appearance. Legacy renderer aliases remain accepted; `nodes`/`updateNodes` are the canvas editor contract.

`GeneralNode` and `GeneralNodeConfig` expose the configurable built-in renderer and editor. `NodeReadoutLayout`, `ReadoutContent`, and `NodeValueSource` expose the shared center layout, readout and source editor. Prefer a data-only `general` preset when these building blocks already cover the node; it gets the built-in channel-drop, table and command behavior directly.

## Palette defaults and channel drops

`addSchematicNode` adds a browser/gallery entry by default. Set `palette: false` to register only the renderer, then add named variants with `addSchematicNodePreset({id, name, category, node: {type, data}})`. Presets referencing that renderer inherit its `propDefaults` and `dataDefaults`; nested overrides preserve unrelated defaults. Put geometry in `propDefaults` or the preset's `node`, and data overrides in `palette.defaults`.

Custom renderers opt into channel insertion and existing-node drops with `channelBinding: "general"`, `"readout"`, or `"control"`. General follows its configured commandability; Control pairs the command channel with its `_state` channel when available. Built-in binding rules carry the title and case-sensitive units. A custom binding can supply `{paired, bind(data, context)}` instead; return a synchronous data patch, without channel writes or I/O. The context contains the dropped channel/reference, channel metadata, channel catalog and resolved command/state pair. `bindSchematicChannel` exposes the same rules for an author-owned drop handler.

Custom handles use stable IDs and normalized `x`/`y` coordinates from 0 to 1. Set `side` to the outward `left`, `right`, `top`, or `bottom` direction for perpendicular edge routing. `fluid_port_roles` retains its saved compatibility name; its values are `sink`, `source`, and `none`, shown as Handle Roles in the editor. Roles describe activity propagation, not edge direction. Source activation remains driven by the host's supported valve, pump and tank behavior; assigning a role alone does not simulate equipment.

## Independent fluid paths

Use named paths when one symbol contains separate fluid circuits, such as a heat exchanger. `SchematicFluidPath` is part of the public `schematic-nodes` entrypoint. Its stable `id` identifies the group, `label` names it for operators, and `ports` lists the connection port IDs that share activity. This declares passive relays; it does not simulate equipment or activate a source.

```ts
import type {SchematicFluidPath, SchematicNodeData} from "@dartwic/interface-sdk/schematic-nodes";

const paths: SchematicFluidPath[] = [
    {id: "circuit-1", label: "Circuit 1", ports: ["left", "right"]},
    {id: "circuit-2", label: "Circuit 2", ports: ["bottom", "top"]},
];
const dataDefaults: SchematicNodeData = {
    connection_ports: [
        {id: "left", label: "Entry 1", x: 0, y: .5, side: "left"},
        {id: "right", label: "Output 1", x: 1, y: .5, side: "right"},
        {id: "bottom", label: "Entry 2", x: .5, y: 1, side: "bottom"},
        {id: "top", label: "Output 2", x: .5, y: 0, side: "top"},
    ],
    fluid_port_roles: {left: "sink", right: "source", bottom: "sink", top: "source"},
    fluid_paths: paths,
};
```

Pass `dataDefaults` to `addSchematicNode`, or use the same data in a `general` preset. The shared **Node Setup / Handle roles** editor always shows the path list and a path selector for each handle. Nodes using the traditional shared-Sink behavior show one default path; adding another path needs no mode switch. Operators can add, rename, delete extra paths, or reassign handles without changing the renderer. Configuration edits are synchronous node-data patches; normal schematic saving persists them, and undo restores the previous configuration. The host supplies this editor and the edit-mode overlay to custom SDK nodes too.

Each port belongs to at most one path. Membership is unordered: Source/Sink roles describe the endpoints, independently of the order in `ports` or the direction an edge was drawn. Unlisted ports are isolated. An omitted `fluid_paths` inherits renderer defaults, while `null` explicitly selects the traditional shared-Sink relay behavior. An empty array isolates every port. Source outputs within a passive path relay existing activity and never generate activity by themselves. Pumps, valves, tanks, and ties retain their specialized activity rules.

For nodes with more than one path, hover or select the node in edit mode to see numbered, colored dashed paths while its handles are visible. The numbers and colors match the path list; crossing paths remain separate groups. These guides disappear in view mode and do not receive pointer events or alter routing.

The optional field is additive and does not change the host ABI or Engine protocol. A plugin depending on independent paths must require an Interface release that implements grouped flow paths through its manifest's `minInterfaceVersion`; older hosts can ignore the field and use their previous relay behavior. Type availability alone does not establish host support.

## Compatibility and completion

These authoring APIs are provided by the 2.1.0 Interface SDK and host. Older plugins keep their renderer identifiers, aliases and saved node data. No Engine API or plugin ABI change is required. A plugin using the new components requires a host that provides them; missing components report a capability error. Rendering and registration do not prove a command succeeded. Operator commands still pass through Engine authority and ordinary asynchronous operation responses, while observed channel data supplies readback.

See the [schematic node reference](Reference/Interface/Schematic%20Nodes/Overview.md) for signatures and the [Interface plugin guide](Interface%20Plugin.md) for packaging.
