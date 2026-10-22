---
title: "TaskCardDefinition"
summary: "Task type and component registered as a task card."
---

## Import

```ts
import type { TaskCardDefinition } from "@dartwic/interface-sdk/tasks";
```

## Declaration

```ts
export interface TaskCardDefinition {
    taskType: string;
    component: TaskComponent;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `taskType` | `string` | Required |  |
| `component` | `TaskComponent` | Required |  |
