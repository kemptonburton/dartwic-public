---
title: "ModuleConfigDefinition"
summary: "Component registered as a module configuration editor."
---

## Import

```ts
import type { ModuleConfigDefinition } from "@dartwic/interface-sdk/module-configs";
```

## Declaration

```ts
export interface ModuleConfigDefinition {
    component: (props: ModuleConfigProps) => any;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `component` | `(props: ModuleConfigProps) => any` | Required |  |
