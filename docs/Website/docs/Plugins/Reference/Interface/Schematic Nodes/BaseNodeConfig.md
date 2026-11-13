---
title: BaseNodeConfig
summary: Render the standard shared editor and dedicated sections.
created: 2026-11-12T15:51
updated: 2026-11-13T00:56
---

## Import

```ts
import { BaseNodeConfig } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export const BaseNodeConfig: HostComponent<BaseNodeConfigProps>;
```

## BaseNodeConfigProps

Shared Node Setup and Node Appearance editor with optional dedicated tabs.

```ts
export interface BaseNodeConfigProps extends SchematicNodeConfigProps {
    sections?: SchematicNodeConfigSection[];
    artworkOnly?: boolean;
    sharedOnly?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `sections` | `SchematicNodeConfigSection[]` | Optional |  |
| `artworkOnly` | `boolean` | Optional |  |
| `sharedOnly` | `boolean` | Optional |  |
| `nodes` | `SchematicNodeRecord[]` | Required | Canvas node records. updateNodes patches node records, not just their data. |
| `updateNodes` | `void` | Required |  |
| `draft` | `boolean` | Optional |  |
| `data` | `any` | Optional |  |
| `updateNode` | `(nextData: any) => void` | Optional |  |
| `defaults` | `any` | Optional |  |
