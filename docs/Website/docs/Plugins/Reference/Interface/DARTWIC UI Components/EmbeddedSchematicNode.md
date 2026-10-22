---
title: EmbeddedSchematicNode
summary: Embed a schematic node using the host component.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { EmbeddedSchematicNode } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const EmbeddedSchematicNode: HostComponent<EmbeddedSchematicNodeProps>;
```

## EmbeddedSchematicNodeProps

One remote schematic node embedded in a plugin view.

```ts
export interface EmbeddedSchematicNodeProps extends HostComponentProps {
    commandEnabled?: boolean;
    schematicPath?: string;
    nodeId?: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `commandEnabled` | `boolean` | Optional |  |
| `schematicPath` | `string` | Optional |  |
| `nodeId` | `string` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
