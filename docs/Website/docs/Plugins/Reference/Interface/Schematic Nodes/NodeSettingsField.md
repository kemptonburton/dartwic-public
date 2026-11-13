---
title: "NodeSettingsField"
summary: "Searchable, mixed-value-aware entry in a node configuration section."
---

## Import

```ts
import { NodeSettingsField } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export const NodeSettingsField: HostComponent<NodeSettingsFieldProps>;
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
