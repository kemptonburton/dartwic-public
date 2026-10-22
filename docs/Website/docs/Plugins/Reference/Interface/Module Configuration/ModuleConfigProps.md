---
title: "ModuleConfigProps"
summary: "Props passed to a module configuration component."
---

## Import

```ts
import type { ModuleConfigProps } from "@dartwic/interface-sdk/module-configs";
```

## Declaration

```ts
export interface ModuleConfigProps {
    instanceConfig: any;
    setInstanceConfig: (nextValue: any) => void;
    save: () => Promise<void> | void;
    moduleConfig?: any;
    moduleEditor?: ModuleConfigRegistration | null;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `instanceConfig` | `any` | Required |  |
| `setInstanceConfig` | `(nextValue: any) => void` | Required |  |
| `save` | `() => Promise<void> \| void` | Required |  |
| `moduleConfig` | `any` | Optional |  |
| `moduleEditor` | `ModuleConfigRegistration \| null` | Optional |  |
