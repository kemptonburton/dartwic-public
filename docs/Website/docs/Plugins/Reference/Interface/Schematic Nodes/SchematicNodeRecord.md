---
title: SchematicNodeRecord
summary: Serializable node instance or preset, independent of its renderer.
created: 2026-11-12T15:51
updated: 2026-11-13T00:56
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
