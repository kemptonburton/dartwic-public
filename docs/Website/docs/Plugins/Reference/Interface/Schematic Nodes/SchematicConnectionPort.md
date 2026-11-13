---
title: "SchematicConnectionPort"
summary: "Stable normalized connection coordinate and outward edge direction."
---

## Import

```ts
import type { SchematicConnectionPort } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicConnectionPort {
    id: string;
    label?: string;
    x: number;
    y: number;
    side?: "left" | "right" | "top" | "bottom";
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required |  |
| `label` | `string` | Optional |  |
| `x` | `number` | Required |  |
| `y` | `number` | Required |  |
| `side` | `"left" \| "right" \| "top" \| "bottom"` | Optional |  |
