---
title: "ModuleConnectionPresentation"
summary: "Optional live connection presentation used by module headers and resource navigation."
---

## Import

```ts
import type { ModuleConnectionPresentation } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface ModuleConnectionPresentation {
    channel: string;
    label?: string;
    endpoint?: string;
    connectedValue?: string | number | boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel` | `string` | Required |  |
| `label` | `string` | Optional |  |
| `endpoint` | `string` | Optional |  |
| `connectedValue` | `string \| number \| boolean` | Optional |  |
