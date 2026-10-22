---
title: useTaskConfigBridge
summary: Synchronizes save, cancel, dirty, and validation state with the host task editor.
created: 2026-08-04T17:38
updated: 2026-09-26T14:50
---

## Import

```ts
import { useTaskConfigBridge } from "@dartwic/interface-sdk/tasks";
```

## Declaration

```ts
export function useTaskConfigBridge(taskEditor: TaskConfigRegistration | null | undefined, config: TaskConfigBridgeState = {}) {
    const {
        isDirty = false,
        isSaving = false,
        canSave = true,
        errorMessage = "",
        saveLabel = "SAVE",
        cancelLabel = "CANCEL",
        onSave = null,
        onCancel = null,
        moduleConnection = null,
    } = config;

    (React as any).useEffect(() => {
        taskEditor?.register?.({
            isDirty,
            isSaving,
            canSave,
            errorMessage,
            saveLabel,
            cancelLabel,
            onSave,
            onCancel,
            moduleConnection,
        });
    }, [
        taskEditor,
        isDirty,
        isSaving,
        canSave,
        errorMessage,
        saveLabel,
        cancelLabel,
        onSave,
        onCancel,
        moduleConnection,
    ]);
}
```
