---
title: TaskConfigDefinition
summary: Task type and component registered as a configuration editor.
created: 2026-08-04T17:38
updated: 2026-10-25T20:52
---

## Import

```ts
import type { TaskConfigDefinition } from "@dartwic/interface-sdk/tasks";
```

## Declaration

```ts
export interface TaskConfigDefinition {
    configMap?: import("../config-maps/index.ts").ConfigMapDefinition;
    /** Host normalization metadata; set by the registrar for an explicit editor with configMap. */
    customConfigMapLayout?: boolean;
    taskType: string;
    component: TaskComponent;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `configMap` | `import("../config-maps/index.ts").ConfigMapDefinition` | Optional |  |
| `customConfigMapLayout` | `boolean` | Optional | Host normalization metadata; set by the registrar for an explicit editor with configMap. |
| `taskType` | `string` | Required |  |
| `component` | `TaskComponent` | Required |  |
