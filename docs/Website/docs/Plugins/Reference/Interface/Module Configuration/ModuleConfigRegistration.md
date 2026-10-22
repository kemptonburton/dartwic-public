---
title: "ModuleConfigRegistration"
summary: "Bridge exposed by the host module editor to a plugin configuration component."
---

## Import

```ts
import type { ModuleConfigRegistration } from "@dartwic/interface-sdk/module-configs";
```

## Declaration

```ts
export interface ModuleConfigRegistration {
    register(nextState?: ModuleConfigBridgeState): void;
    setDirty?(isDirty: boolean): void;
    setSaving?(isSaving: boolean): void;
    setCanSave?(canSave: boolean): void;
    setErrorMessage?(errorMessage: string): void;
    reset?(): void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `register` | `void` | Required |  |
| `setDirty` | `void` | Optional |  |
| `setSaving` | `void` | Optional |  |
| `setCanSave` | `void` | Optional |  |
| `setErrorMessage` | `void` | Optional |  |
| `reset` | `void` | Optional |  |
