---
title: "createTaskConfigAdapter"
summary: "Edit an existing task through the Engine's configuration/recovery path with expected-argument conflict detection. Preserve metadata; the Engine owns running/hold restoration. Resolve after application and a fresh observation, or reject. No new storage is created."
---

## Import

```ts
import { createTaskConfigAdapter } from "@dartwic/interface-sdk/config-maps";
```

## Declaration

```ts
export function createTaskConfigAdapter(): Pick<ConfigMapDefinition, 'load' | 'apply'> {
    const load = async (context: any) => {
        const inventory = await request(context, 'dartwic/get-registered-tasks', {query: '', limit: 0});
        const task = inventory.tasks?.find((item: any) => item.name === context.task?.name);
        if (!task) throw new Error(`Task ${context.task?.name} is unavailable.`);
        return task;
    };
    return {load, async apply(next, previous, context) {
        if (next.name !== previous.name || next.task_type !== previous.task_type) throw new Error('Change task identity through the task resource.');
        await request(context, 'dartwic/create-task', {task_name: next.name, task_type: next.task_type,
            portal_name: next.portal, metadata: next.metadata || {}, arguments: next.arguments, expected_arguments: previous.arguments});
        const accepted = await load(context);
        changed('tasks', 'channels');
        return accepted;
    }};
}
```
