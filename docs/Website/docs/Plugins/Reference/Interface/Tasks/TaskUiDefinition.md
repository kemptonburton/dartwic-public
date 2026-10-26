---
title: TaskUiDefinition
summary: Registers task card and editor components under one task type.
created: 2026-08-04T17:38
updated: 2026-10-25T20:52
---

## Import

```ts
import type { TaskUiDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface TaskUiDefinition extends NamedContribution {
    /** Optional shared document declaration. An explicit editor owns its layout and can render multiple ConfigMap group views. */
    configMap?: ConfigMapDefinition;
    card?: TaskCardDefinition["component"];
    editor?: TaskConfigDefinition["component"];
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `configMap` | `ConfigMapDefinition` | Optional | Optional shared document declaration. An explicit editor owns its layout and can render multiple ConfigMap group views. |
| `card` | `TaskCardDefinition["component"]` | Optional |  |
| `editor` | `TaskConfigDefinition["component"]` | Optional |  |
