---
title: "SchematicNodeConfigSection"
summary: "Dedicated custom-content tab appended to the shared node editor."
---

## Import

```ts
import type { SchematicNodeConfigSection } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodeConfigSection {
    title: string;
    value: string;
    content: any;
    bare?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `title` | `string` | Required |  |
| `value` | `string` | Required |  |
| `content` | `any` | Required |  |
| `bare` | `boolean` | Optional |  |
