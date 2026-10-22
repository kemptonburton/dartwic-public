---
title: "ModuleConfigBridgeState"
summary: "State published to the host by `useModuleConfigBridge`."
---

## Import

```ts
import type { ModuleConfigBridgeState } from "@dartwic/interface-sdk/module-configs";
```

## Declaration

```ts
export interface ModuleConfigBridgeState {
    isDirty?: boolean;
    isSaving?: boolean;
    canSave?: boolean;
    errorMessage?: string;
    saveLabel?: string;
    onSave?: (() => Promise<void> | void) | null;
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
| `onSave` | `(() => Promise<void> \| void) \| null` | Optional |  |
