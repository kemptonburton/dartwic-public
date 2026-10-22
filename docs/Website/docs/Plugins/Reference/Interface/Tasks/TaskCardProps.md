---
title: "TaskCardProps"
summary: "Props passed to a task card."
---

## Import

```ts
import type { TaskCardProps } from "@dartwic/interface-sdk/tasks";
```

## Declaration

```ts
export interface TaskCardProps {
    task: any;
    openSource?: (...args: any[]) => void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `task` | `any` | Required |  |
| `openSource` | `(...args: any[]) => void` | Optional |  |
