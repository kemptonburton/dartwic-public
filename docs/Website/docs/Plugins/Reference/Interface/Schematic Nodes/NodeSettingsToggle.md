---
title: NodeSettingsToggle
summary: Searchable, mixed-value-aware switch in a node configuration section.
created: 2026-11-12T15:51
updated: 2026-11-13T00:56
---

## Import

```ts
import { NodeSettingsToggle } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export const NodeSettingsToggle: HostComponent<NodeSettingsFieldProps>;
```

## NodeSettingsFieldProps

A searchable configuration entry; settingPath enables shared selection editing and mixed values.

```ts
export interface NodeSettingsFieldProps {
    [key: string]: any;
    label: string;
    settingPath?: string;
    settingValue?: (node: SchematicNodeRecord) => unknown;
    relatedPaths?: string[];
    children?: any;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `label` | `string` | Required |  |
| `settingPath` | `string` | Optional |  |
| `settingValue` | `(node: SchematicNodeRecord) => unknown` | Optional |  |
| `relatedPaths` | `string[]` | Optional |  |
| `children` | `any` | Optional |  |
