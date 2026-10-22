---
title: "createWorkspaceAssetClient"
summary: "Create shared asset readers and writers with a local read cache."
---

## Import

```ts
import { createWorkspaceAssetClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createWorkspaceAssetClient(operation: AssetOperation): {
    readText(path: string): Promise<string>;
    readJson<T = unknown>(path: string): Promise<T>;
    saveText(namespace: string, name: string, content: string): Promise<string>;
    saveJson(namespace: string, name: string, value: unknown): Promise<string>;
    invalidate(path: string): void;
};
```
