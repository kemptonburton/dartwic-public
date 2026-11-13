---
title: SchematicNodePresetDefinition
summary: Named data-only browser, Insert Node and gallery contribution. Use type general for shared building blocks.
created: 2026-11-12T15:51
updated: 2026-11-13T00:56
---

## Import

```ts
import type { SchematicNodePresetDefinition } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodePresetDefinition {
    id: string;
    name: string;
    category?: string;
    node: SchematicNodeRecord;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required |  |
| `name` | `string` | Required |  |
| `category` | `string` | Optional |  |
| `node` | `SchematicNodeRecord` | Required |  |
