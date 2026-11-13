---
title: "GeneralNodeConfig"
summary: "Edit General Node using the same tabs and mixed-selection behavior as built-ins."
---

## Import

```ts
import { GeneralNodeConfig } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export const GeneralNodeConfig: HostComponent<SchematicNodeConfigProps>;
```

## SchematicNodeConfigProps

Props passed to a schematic node configuration component.

```ts
export interface SchematicNodeConfigProps {
    [key: string]: any;
    /** Canvas node records. updateNodes patches node records, not just their data. */
    nodes: SchematicNodeRecord[];
    updateNodes(nodes: SchematicNodeRecord[], patch: Partial<SchematicNodeRecord> | ((node: SchematicNodeRecord) => Partial<SchematicNodeRecord>), options?: Record<string, unknown>): void;
    draft?: boolean;
    data?: any;
    updateNode?: (nextData: any) => void;
    defaults?: any;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `nodes` | `SchematicNodeRecord[]` | Required | Canvas node records. updateNodes patches node records, not just their data. |
| `updateNodes` | `void` | Required |  |
| `draft` | `boolean` | Optional |  |
| `data` | `any` | Optional |  |
| `updateNode` | `(nextData: any) => void` | Optional |  |
| `defaults` | `any` | Optional |  |
