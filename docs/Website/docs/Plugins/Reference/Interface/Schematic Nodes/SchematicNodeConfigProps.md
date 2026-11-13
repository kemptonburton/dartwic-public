---
title: SchematicNodeConfigProps
summary: Props passed to a schematic node configuration component.
created: 2026-08-04T17:38
updated: 2026-11-13T00:56
---

## Import

```ts
import type { SchematicNodeConfigProps } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

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

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `nodes` | `SchematicNodeRecord[]` | Required | Canvas node records. updateNodes patches node records, not just their data. |
| `updateNodes` | `void` | Required |  |
| `draft` | `boolean` | Optional |  |
| `data` | `any` | Optional |  |
| `updateNode` | `(nextData: any) => void` | Optional |  |
| `defaults` | `any` | Optional |  |
