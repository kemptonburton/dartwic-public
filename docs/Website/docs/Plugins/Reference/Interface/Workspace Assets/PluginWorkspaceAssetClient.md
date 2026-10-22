---
title: "PluginWorkspaceAssetClient"
summary: "Authored plugin files confined by these helpers to workspace/assets/plugins/id. Project settings, secrets and runtime retain their scopes."
---

## Import

```ts
import type { PluginWorkspaceAssetClient } from "@dartwic/interface-sdk/assets";
```

## Declaration

```ts
export interface PluginWorkspaceAssetClient {
    /** Return a portable reference without I/O. */
    path(relative: string): string;
    /** Read UTF-8; missing/unauthorized files reject. Cached per callback. */
    readText(relative: string): Promise<string>;
    /** Read JSON; the generic type adds no runtime schema validation. */
    readJson<T = unknown>(relative: string): Promise<T>;
    /** Atomically save text, then return its portable reference. Requires administrator authority. */
    saveText(relative: string, content: string): Promise<string>;
    /** Serialize and save JSON, returning its portable reference. */
    saveJson(relative: string, value: unknown): Promise<string>;
    /** Evict a cached relative file after an external change. */
    invalidate(relative: string): void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `path` | `string` | Required | Return a portable reference without I/O. |
| `readText` | `Promise<string>` | Required | Read UTF-8; missing/unauthorized files reject. Cached per callback. |
| `readJson` | `Promise<T>` | Required | Read JSON; the generic type adds no runtime schema validation. |
| `saveText` | `Promise<string>` | Required | Atomically save text, then return its portable reference. Requires administrator authority. |
| `saveJson` | `Promise<string>` | Required | Serialize and save JSON, returning its portable reference. |
| `invalidate` | `void` | Required | Evict a cached relative file after an external change. |
