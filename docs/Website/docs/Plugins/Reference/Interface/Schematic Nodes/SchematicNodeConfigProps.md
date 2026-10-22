---
title: "SchematicNodeConfigProps"
summary: "Props passed to a schematic node configuration component."
---

## Import

```ts
import type { SchematicNodeConfigProps } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodeConfigProps {
    data?: any;
    updateNode?: (nextData: any) => void;
    defaults?: any;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `data` | `any` | Optional |  |
| `updateNode` | `(nextData: any) => void` | Optional |  |
| `defaults` | `any` | Optional |  |
