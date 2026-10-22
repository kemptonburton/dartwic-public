---
title: "WorkspaceAssetClient"
summary: "Shared authored UTF-8/JSON file operations. Stored paths are workspace-relative assets/... references."
---

## Import

```ts
import type { WorkspaceAssetClient } from "@dartwic/interface-sdk/assets";
```

## Declaration

```ts
export interface WorkspaceAssetClient {
    /** Read a portable reference; missing or unauthorized files reject. */
    readText(path: string): Promise<string>;
    /** Read and parse JSON without runtime schema validation. */
    readJson<T = unknown>(path: string): Promise<T>;
    /** Save namespace/file atomically and return its portable reference. */
    saveText(namespace: string, name: string, content: string): Promise<string>;
    /** Serialize JSON, save it and return its portable reference. */
    saveJson(namespace: string, name: string, value: unknown): Promise<string>;
    /** Evict a cached reference after an external change. */
    invalidate(path: string): void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `readText` | `Promise<string>` | Required | Read a portable reference; missing or unauthorized files reject. |
| `readJson` | `Promise<T>` | Required | Read and parse JSON without runtime schema validation. |
| `saveText` | `Promise<string>` | Required | Save namespace/file atomically and return its portable reference. |
| `saveJson` | `Promise<string>` | Required | Serialize JSON, save it and return its portable reference. |
| `invalidate` | `void` | Required | Evict a cached reference after an external change. |
