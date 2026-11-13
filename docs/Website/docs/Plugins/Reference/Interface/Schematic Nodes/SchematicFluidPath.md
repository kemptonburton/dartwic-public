---
title: SchematicFluidPath
summary: One independent passive fluid relay group. IDs remain stable when paths are renamed or reordered.
created: 2026-11-12T23:58
updated: 2026-11-13T00:56
---

## Import

```ts
import type { SchematicFluidPath } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicFluidPath {
    /** Unique within the node. */
    id: string;
    /** Operator-facing name in the shared editor. */
    label?: string;
    /** Stable connection port IDs. A port belongs to at most one path. */
    ports: string[];
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Unique within the node. |
| `label` | `string` | Optional | Operator-facing name in the shared editor. |
| `ports` | `string[]` | Required | Stable connection port IDs. A port belongs to at most one path. |
