---
title: SchematicNodeDefinition
summary: Complete renderer, editor, palette, sizing, and command contract for a node type.
created: 2026-08-04T17:38
updated: 2026-11-12T23:58
---

## Import

```ts
import type { SchematicNodeDefinition } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodeDefinition {
    type: string;
    component: (props: BaseNodeProps) => any;
    configComponent?: (props: SchematicNodeConfigProps) => any;
    getCommandActions?: (context: SchematicCommandContext) => SchematicCommandAction[];
    selectionIcon?: any;
    propDefaults?: Record<string, unknown>;
    dataDefaults?: SchematicNodeData;
    resizable?: boolean;
    connectable?: boolean;
    useMeasuredSize?: boolean;
    /** Set false to register a renderer without a browser/gallery entry. */
    palette?: SchematicNodePaletteDefinition | false;
    /** True when configComponent already renders BaseNodeConfig or GeneralNodeConfig. */
    configIncludesBase?: boolean;
    /** Opt into Insert Node and existing-node channel drops using shared or custom binding rules. */
    channelBinding?: "general" | "readout" | "control" | SchematicChannelBinding;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `type` | `string` | Required |  |
| `component` | `(props: BaseNodeProps) => any` | Required |  |
| `configComponent` | `(props: SchematicNodeConfigProps) => any` | Optional |  |
| `getCommandActions` | `(context: SchematicCommandContext) => SchematicCommandAction[]` | Optional |  |
| `selectionIcon` | `any` | Optional |  |
| `propDefaults` | `Record<string, unknown>` | Optional |  |
| `dataDefaults` | `SchematicNodeData` | Optional |  |
| `resizable` | `boolean` | Optional |  |
| `connectable` | `boolean` | Optional |  |
| `useMeasuredSize` | `boolean` | Optional |  |
| `palette` | `SchematicNodePaletteDefinition \| false` | Optional | Set false to register a renderer without a browser/gallery entry. |
| `configIncludesBase` | `boolean` | Optional | True when configComponent already renders BaseNodeConfig or GeneralNodeConfig. |
| `channelBinding` | `"general" \| "readout" \| "control" \| SchematicChannelBinding` | Optional | Opt into Insert Node and existing-node channel drops using shared or custom binding rules. |
