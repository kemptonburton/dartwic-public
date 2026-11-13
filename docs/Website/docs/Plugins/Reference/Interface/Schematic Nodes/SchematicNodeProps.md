---
title: SchematicNodeProps
summary: Props passed to the canvas renderer for one schematic node.
created: 2026-08-04T17:38
updated: 2026-11-13T00:56
---

## Import

```ts
import type { SchematicNodeProps } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodeProps {
    [key: string]: any;
    type?: string;
    width?: number;
    height?: number;
    data?: any;
    selected?: boolean;
    id?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `type` | `string` | Optional |  |
| `width` | `number` | Optional |  |
| `height` | `number` | Optional |  |
| `data` | `any` | Optional |  |
| `selected` | `boolean` | Optional |  |
| `id` | `string` | Optional |  |
