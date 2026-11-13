---
title: "SchematicChannelBinding"
summary: "Synchronous data patch only; must not write channel values or perform I/O."
---

## Import

```ts
import type { SchematicChannelBinding } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicChannelBinding {
    paired?: boolean | ((data: SchematicNodeData) => boolean);
    bind(data: SchematicNodeData, context: SchematicChannelDropContext): Partial<SchematicNodeData>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `paired` | `boolean \| ((data: SchematicNodeData) => boolean)` | Optional |  |
| `bind` | `Partial<SchematicNodeData>` | Required |  |
