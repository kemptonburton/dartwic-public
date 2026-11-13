---
title: "SchematicNodeRecord"
summary: "Serializable node instance or preset, independent of its renderer."
---

## Import

```ts
import type { SchematicNodeRecord } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodeRecord {
    [key: string]: any;
    type: string;
    id?: string;
    width?: number;
    height?: number;
    position?: {x: number; y: number};
    data: SchematicNodeData;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `type` | `string` | Required |  |
| `id` | `string` | Optional |  |
| `width` | `number` | Optional |  |
| `height` | `number` | Optional |  |
| `position` | `{x: number; y: number}` | Optional |  |
| `data` | `SchematicNodeData` | Required |  |
