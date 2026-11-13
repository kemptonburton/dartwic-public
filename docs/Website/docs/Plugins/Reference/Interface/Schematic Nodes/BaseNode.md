---
title: "BaseNode"
summary: "Use the host's shared node backend with a custom center. No Engine write occurs during rendering."
---

## Import

```ts
import { BaseNode } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export const BaseNode: HostComponent<BaseNodeProps>;
```

## BaseNodeProps

Shared canvas wrapper: labels, rotation/size, handle roles, inspection and alerts.

```ts
export interface BaseNodeProps extends SchematicNodeProps {
    type: string;
    data: SchematicNodeData;
    children?: any;
    /** Historical spelling retained by the host. */
    resizeable?: boolean;
    useAlerts?: boolean;
    runtimeStatusColor?: string;
    alertTags?: string[];
    contextActions?: Array<{label: string; onSelect: () => void}>;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `type` | `string` | Required |  |
| `data` | `SchematicNodeData` | Required |  |
| `children` | `any` | Optional |  |
| `resizeable` | `boolean` | Optional | Historical spelling retained by the host. |
| `useAlerts` | `boolean` | Optional |  |
| `runtimeStatusColor` | `string` | Optional |  |
| `alertTags` | `string[]` | Optional |  |
| `contextActions` | `Array<{label: string; onSelect: () => void}>` | Optional |  |
| `width` | `number` | Optional |  |
| `height` | `number` | Optional |  |
| `selected` | `boolean` | Optional |  |
| `id` | `string` | Optional |  |
