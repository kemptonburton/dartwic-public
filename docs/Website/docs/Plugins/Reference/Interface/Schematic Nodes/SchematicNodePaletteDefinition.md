---
title: "SchematicNodePaletteDefinition"
summary: "Palette label and default node data for a schematic contribution."
---

## Import

```ts
import type { SchematicNodePaletteDefinition } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodePaletteDefinition {
    name?: string;
    defaults?: Record<string, unknown>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Optional |  |
| `defaults` | `Record<string, unknown>` | Optional |  |
