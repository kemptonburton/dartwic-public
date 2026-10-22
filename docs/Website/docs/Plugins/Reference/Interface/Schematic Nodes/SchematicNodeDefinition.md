---
title: "SchematicNodeDefinition"
summary: "Complete renderer, editor, palette, sizing, and command contract for a node type."
---

## Import

```ts
import type { SchematicNodeDefinition } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodeDefinition {
    type: string;
    component: (props: SchematicNodeProps) => any;
    configComponent?: (props: SchematicNodeConfigProps) => any;
    getCommandActions?: (context: SchematicCommandContext) => SchematicCommandAction[];
    selectionIcon?: any;
    propDefaults?: Record<string, unknown>;
    dataDefaults?: Record<string, unknown>;
    resizable?: boolean;
    connectable?: boolean;
    useMeasuredSize?: boolean;
    palette?: SchematicNodePaletteDefinition;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `type` | `string` | Required |  |
| `component` | `(props: SchematicNodeProps) => any` | Required |  |
| `configComponent` | `(props: SchematicNodeConfigProps) => any` | Optional |  |
| `getCommandActions` | `(context: SchematicCommandContext) => SchematicCommandAction[]` | Optional |  |
| `selectionIcon` | `any` | Optional |  |
| `propDefaults` | `Record<string, unknown>` | Optional |  |
| `dataDefaults` | `Record<string, unknown>` | Optional |  |
| `resizable` | `boolean` | Optional |  |
| `connectable` | `boolean` | Optional |  |
| `useMeasuredSize` | `boolean` | Optional |  |
| `palette` | `SchematicNodePaletteDefinition` | Optional |  |
