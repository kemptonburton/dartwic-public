---
title: "TaskConfigRegistration"
summary: "Bridge exposed by the host task editor to a plugin configuration component."
---

## Import

```ts
import type { TaskConfigRegistration } from "@dartwic/interface-sdk/tasks";
```

## Declaration

```ts
export interface TaskConfigRegistration {
    register(nextState?: Record<string, unknown>): void;
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
