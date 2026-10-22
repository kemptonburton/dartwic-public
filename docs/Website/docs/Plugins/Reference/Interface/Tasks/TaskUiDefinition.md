---
title: "TaskUiDefinition"
summary: "Registers task card and editor components under one task type."
---

## Import

```ts
import type { TaskUiDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface TaskUiDefinition extends NamedContribution {
    card?: TaskCardDefinition["component"];
    editor?: TaskConfigDefinition["component"];
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `card` | `TaskCardDefinition["component"]` | Optional |  |
| `editor` | `TaskConfigDefinition["component"]` | Optional |  |
