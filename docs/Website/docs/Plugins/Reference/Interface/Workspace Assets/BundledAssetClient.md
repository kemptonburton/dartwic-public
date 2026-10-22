---
title: "BundledAssetClient"
summary: "Read-only bundled UTF-8/JSON files. Updates replace them. Missing files and invalid JSON reject; no caching or real-time bound."
---

## Import

```ts
import type { BundledAssetClient } from "@dartwic/interface-sdk/assets";
```

## Declaration

```ts
export interface BundledAssetClient {
    /** Read a validated path relative to the plugin assets folder. */
    readText(relative: string): Promise<string>;
    /** Read JSON without runtime schema validation. */
    readJson<T = unknown>(relative: string): Promise<T>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `readText` | `Promise<string>` | Required | Read a validated path relative to the plugin assets folder. |
| `readJson` | `Promise<T>` | Required | Read JSON without runtime schema validation. |
