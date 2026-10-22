---
title: ModuleRuntimeOverview
summary: Shows linked tasks, state, channels and measured frequency. Start, Stop and Hold require a connected administrator and two clicks within four seconds; rebuilding disables them. Writes request changes asynchronously; live telemetry reports state separately.
created: 2026-10-04T18:31
updated: 2026-10-21T15:16
---

## Import

```ts
import { ModuleRuntimeOverview } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ModuleRuntimeOverview: HostComponent<ModuleRuntimeOverviewProps>;
```

## ModuleRuntimeOverviewProps

Props for the standard linked-task, status, and channel overview on module pages.

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

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `instanceName` | `string` | Required | Module instance whose linked tasks are displayed. |
| `connectionChannel` | `string` | Optional | Optional live boolean channel used for connection state. |
| `connectionLabel` | `string` | Optional | Visible label beside the connection state. |
| `endpoint` | `string` | Optional | Human-readable connection endpoint. |
| `taskTypeIds` | `string[]` | Optional | Optional task-type allowlist. |
| `resolveTaskChannels` | `(task: any) => ModuleRuntimeChannel[]` | Optional | Maps a linked task's plugin arguments to visible live channels. |
| `emptyMessage` | `string` | Optional | Empty-state copy when no tasks reference the module. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
