---
title: "TaskConfigDefinition"
summary: "Task type and component registered as a configuration editor."
---

## Import

```ts
import type { TaskConfigDefinition } from "@dartwic/interface-sdk/tasks";
```

## Declaration

```ts
export interface TaskConfigDefinition {
    taskType: string;
    component: TaskComponent;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `taskType` | `string` | Required |  |
| `component` | `TaskComponent` | Required |  |
