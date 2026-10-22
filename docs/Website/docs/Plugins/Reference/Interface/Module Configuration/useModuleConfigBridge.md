---
title: "useModuleConfigBridge"
summary: "Synchronizes save, dirty, and validation state with the host module header."
---

## Import

```ts
import { useModuleConfigBridge } from "@dartwic/interface-sdk/module-configs";
```

## Declaration

```ts
export function useModuleConfigBridge(
    moduleEditor: ModuleConfigRegistration | null | undefined,
    config: ModuleConfigBridgeState = {},
) {
    const {
        isDirty = false,
        isSaving = false,
        canSave = true,
        errorMessage = "",
        saveLabel = "SAVE CONFIG",
        onSave = null,
    } = config;

    (React as any).useEffect(() => {
        moduleEditor?.register?.({
            isDirty,
            isSaving,
            canSave,
            errorMessage,
            saveLabel,
            onSave,
        });
    }, [moduleEditor, isDirty, isSaving, canSave, errorMessage, saveLabel, onSave]);
}
```
