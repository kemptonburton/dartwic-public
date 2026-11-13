---
title: "NodeSettingsFieldProps"
summary: "A searchable configuration entry; settingPath enables shared selection editing and mixed values."
---

## Import

```ts
import type { NodeSettingsFieldProps } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

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

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `label` | `string` | Required |  |
| `settingPath` | `string` | Optional |  |
| `settingValue` | `(node: SchematicNodeRecord) => unknown` | Optional |  |
| `relatedPaths` | `string[]` | Optional |  |
| `children` | `any` | Optional |  |
