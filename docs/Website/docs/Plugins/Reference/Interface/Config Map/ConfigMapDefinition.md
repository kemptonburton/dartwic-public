---
title: ConfigMapDefinition
summary: A single declaration shared by resource editors and Module Map, without another persistent configuration store.
created: 2026-10-25T12:50
updated: 2026-10-26T19:16
---

load returns the existing full document; the host edits declared paths and preserves other fields. apply must resolve only after existing persistence and the resource's application policy complete, or reject with an actionable error. Return the accepted document, or omit the result to accept next. Context supplies operation and the resource identity (module, task, or plugin). No restart behavior is implied.

## Import

```ts
import type { ConfigMapDefinition } from "@dartwic/interface-sdk/config-maps";
```

## Declaration

```ts
export interface ConfigMapDefinition {
    title?: string;
    groups: Array<{id: string; label: string; fields?: ConfigMapField[]; tables?: ConfigMapTable[]}>;
    load(context: any): Promise<any>;
    apply(next: any, previous: any, context: any): Promise<any>;
    validate?(value: any, context: any): string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `title` | `string` | Optional |  |
| `groups` | `Array<{id: string; label: string; fields?: ConfigMapField[]; tables?: ConfigMapTable[]}>` | Required |  |
| `load` | `Promise<any>` | Required |  |
| `apply` | `Promise<any>` | Required |  |
| `validate` | `string` | Optional |  |
