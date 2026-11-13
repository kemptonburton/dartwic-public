---
title: defineSchematicNodePreset
summary: Define serializable initial data for registration with addSchematicNodePreset. No filesystem writes.
created: 2026-11-12T15:51
updated: 2026-11-13T00:56
---

## Import

```ts
import { defineSchematicNodePreset } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export function defineSchematicNodePreset(definition: SchematicNodePresetDefinition): SchematicNodePresetDefinition {
    if (!definition?.node?.type || !definition.node.data || !definition.name?.trim()) throw new Error('A schematic preset requires a name and node with type and data.');
    return definition;
}
```
