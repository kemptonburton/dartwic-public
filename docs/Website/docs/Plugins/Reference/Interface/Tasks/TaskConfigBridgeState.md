---
title: TaskConfigBridgeState
summary: State published to the host by `useTaskConfigBridge`.
created: 2026-08-04T17:38
updated: 2026-10-04T21:24
---

## Import

```ts
import type { TaskConfigBridgeState } from "@dartwic/interface-sdk/tasks";
```

## Declaration

```ts
export interface TaskConfigBridgeState {
    isDirty?: boolean;
    isSaving?: boolean;
    canSave?: boolean;
    errorMessage?: string;
    saveLabel?: string;
    cancelLabel?: string;
    onSave?: (() => Promise<void> | void) | null;
    onCancel?: (() => Promise<void> | void) | null;
    /** Optional module-instance control rendered by the shared host task-detail body. */
    moduleConnection?: {
        pluginId: string;
        moduleTypeIds?: string[];
        value?: string;
        onValueChange?: (value: string) => void;
        placeholder?: string;
        description?: string;
        showConnectionStatus?: boolean;
    } | null;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `isDirty` | `boolean` | Optional |  |
| `isSaving` | `boolean` | Optional |  |
| `canSave` | `boolean` | Optional |  |
| `errorMessage` | `string` | Optional |  |
| `saveLabel` | `string` | Optional |  |
| `cancelLabel` | `string` | Optional |  |
| `onSave` | `(() => Promise<void> \| void) \| null` | Optional |  |
| `onCancel` | `(() => Promise<void> \| void) \| null` | Optional |  |
| `moduleConnection` | `{<br>        pluginId: string;<br>        moduleTypeIds?: string[];<br>        value?: string;<br>        onValueChange?: (value: string) => void;<br>        placeholder?: string;<br>        description?: string;<br>        showConnectionStatus?: boolean;<br>    } \| null` | Optional | Optional module-instance control rendered by the shared host task-detail body. |
