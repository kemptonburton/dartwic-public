---
title: "EmbeddedSchematicNodeProps"
summary: "One remote schematic node embedded in a plugin view."
---

## Import

```ts
import type { EmbeddedSchematicNodeProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface EmbeddedSchematicNodeProps extends HostComponentProps {
    commandEnabled?: boolean;
    schematicPath?: string;
    nodeId?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `commandEnabled` | `boolean` | Optional |  |
| `schematicPath` | `string` | Optional |  |
| `nodeId` | `string` | Optional |  |
