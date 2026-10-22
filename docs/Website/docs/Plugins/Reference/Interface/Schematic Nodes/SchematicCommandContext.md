---
title: "SchematicCommandContext"
summary: "Runtime context supplied while building node command actions."
---

## Import

```ts
import type { SchematicCommandContext } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicCommandContext {
    data?: any;
    id?: string;
    type?: string;
    channels?: Record<string, any>;
    controlEnabled?: boolean;
    operation?: (operationName: string, payload?: any, timeoutMs?: number) => Promise<any>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `data` | `any` | Optional |  |
| `id` | `string` | Optional |  |
| `type` | `string` | Optional |  |
| `channels` | `Record<string, any>` | Optional |  |
| `controlEnabled` | `boolean` | Optional |  |
| `operation` | `(operationName: string, payload?: any, timeoutMs?: number) => Promise<any>` | Optional |  |
