---
title: "ConfigMapTable"
summary: "Repeatable hardware/channel bindings. New rows are local drafts until required cells are committed."
---

## Import

```ts
import type { ConfigMapTable } from "@dartwic/interface-sdk/config-maps";
```

## Declaration

```ts
export interface ConfigMapTable {
    path: string;
    label: string;
    columns: ConfigMapField[];
    createRow?(): Record<string, any>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `path` | `string` | Required |  |
| `label` | `string` | Required |  |
| `columns` | `ConfigMapField[]` | Required |  |
| `createRow` | `Record<string, any>` | Optional |  |
