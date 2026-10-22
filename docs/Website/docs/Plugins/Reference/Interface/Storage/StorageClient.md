---
title: "StorageClient"
summary: "Scoped file access and layered workspace/project settings."
---

## Import

```ts
import type { StorageClient } from "@dartwic/interface-sdk/storage";
```

## Declaration

```ts
export interface StorageClient {
    readText(ref: FileReference): Promise<string>;
    writeText(ref: FileReference, content: string): Promise<FileReference>;
    readJson(ref: FileReference): Promise<any>;
    writeJson(ref: FileReference, value: any): Promise<FileReference>;
    readEffectiveSettings(defaults?: Record<string, any>, project?: string): Promise<SettingsSnapshot>;
    writeSettingsOverride(scope: 'workspace' | 'project', patch: Record<string, any>, options?: {reset?: string[]; project?: string; revision?: string}): Promise<SettingsSnapshot>;
    resetSettingsOverride(scope: 'workspace' | 'project', reset: string[], options?: {project?: string; revision?: string}): Promise<SettingsSnapshot>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `readText` | `Promise<string>` | Required |  |
| `writeText` | `Promise<FileReference>` | Required |  |
| `readJson` | `Promise<any>` | Required |  |
| `writeJson` | `Promise<FileReference>` | Required |  |
| `readEffectiveSettings` | `Promise<SettingsSnapshot>` | Required |  |
| `writeSettingsOverride` | `Promise<SettingsSnapshot>` | Required |  |
| `resetSettingsOverride` | `Promise<SettingsSnapshot>` | Required |  |
