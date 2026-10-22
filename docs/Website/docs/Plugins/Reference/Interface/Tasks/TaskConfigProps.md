---
title: "TaskConfigProps"
summary: "Props passed to a task configuration component."
---

## Import

```ts
import type { TaskConfigProps } from "@dartwic/interface-sdk/tasks";
```

## Declaration

```ts
export interface TaskConfigProps {
    task: any;
    operation: (...args: any[]) => Promise<any>;
    onSaved?: () => Promise<void> | void;
    onClose?: () => Promise<void> | void;
    openSource?: (...args: any[]) => void;
    taskEditor?: TaskConfigRegistration | null;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `task` | `any` | Required |  |
| `operation` | `(...args: any[]) => Promise<any>` | Required |  |
| `onSaved` | `() => Promise<void> \| void` | Optional |  |
| `onClose` | `() => Promise<void> \| void` | Optional |  |
| `openSource` | `(...args: any[]) => void` | Optional |  |
| `taskEditor` | `TaskConfigRegistration \| null` | Optional |  |
