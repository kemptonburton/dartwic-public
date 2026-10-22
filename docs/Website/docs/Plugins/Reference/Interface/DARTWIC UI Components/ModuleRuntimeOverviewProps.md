---
title: "ModuleRuntimeOverviewProps"
summary: "Props for the standard linked-task, status, and channel overview on module pages."
---

## Import

```ts
import type { ModuleRuntimeOverviewProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ModuleRuntimeOverviewProps extends HostComponentProps {
    /** Module instance whose linked tasks are displayed. */
    instanceName: string;
    /** Optional live boolean channel used for connection state. */
    connectionChannel?: string;
    /** Visible label beside the connection state. */
    connectionLabel?: string;
    /** Human-readable connection endpoint. */
    endpoint?: string;
    /** Optional task-type allowlist. */
    taskTypeIds?: string[];
    /** Maps a linked task's plugin arguments to visible live channels. */
    resolveTaskChannels?: (task: any) => ModuleRuntimeChannel[];
    /** Empty-state copy when no tasks reference the module. */
    emptyMessage?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `instanceName` | `string` | Required | Module instance whose linked tasks are displayed. |
| `connectionChannel` | `string` | Optional | Optional live boolean channel used for connection state. |
| `connectionLabel` | `string` | Optional | Visible label beside the connection state. |
| `endpoint` | `string` | Optional | Human-readable connection endpoint. |
| `taskTypeIds` | `string[]` | Optional | Optional task-type allowlist. |
| `resolveTaskChannels` | `(task: any) => ModuleRuntimeChannel[]` | Optional | Maps a linked task's plugin arguments to visible live channels. |
| `emptyMessage` | `string` | Optional | Empty-state copy when no tasks reference the module. |
