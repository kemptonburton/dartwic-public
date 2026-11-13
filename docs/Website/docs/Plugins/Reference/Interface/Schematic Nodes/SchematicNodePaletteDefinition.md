---
title: SchematicNodePaletteDefinition
summary: Palette label and default node data for a schematic contribution.
created: 2026-08-04T17:38
updated: 2026-11-13T00:56
---

## Import

```ts
import type { SchematicNodePaletteDefinition } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodePaletteDefinition {
    name?: string;
    /** Built-in category id or a custom category shared by browser, Insert Node and gallery. */
    category?: string;
    defaults?: SchematicNodeData;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Optional |  |
| `category` | `string` | Optional | Built-in category id or a custom category shared by browser, Insert Node and gallery. |
| `defaults` | `SchematicNodeData` | Optional |  |
