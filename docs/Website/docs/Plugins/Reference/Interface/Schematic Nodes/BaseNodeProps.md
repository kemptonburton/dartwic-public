---
title: "BaseNodeProps"
summary: "Shared canvas wrapper: labels, rotation/size, handle roles, inspection and alerts."
---

## Import

```ts
import type { BaseNodeProps } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

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

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `type` | `string` | Required |  |
| `data` | `SchematicNodeData` | Required |  |
| `children` | `any` | Optional |  |
| `resizeable` | `boolean` | Optional | Historical spelling retained by the host. |
| `useAlerts` | `boolean` | Optional |  |
| `runtimeStatusColor` | `string` | Optional |  |
| `alertTags` | `string[]` | Optional |  |
| `contextActions` | `Array<{label: string; onSelect: () => void}>` | Optional |  |
