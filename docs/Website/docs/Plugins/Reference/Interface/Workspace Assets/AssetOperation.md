---
title: "AssetOperation"
summary: "Engine operation callback used by asset helpers."
---

## Import

```ts
import type { AssetOperation } from "@dartwic/interface-sdk/assets";
```

## Declaration

```ts
export type AssetOperation = (name: string, payload: Record<string, unknown>) => Promise<{error?: boolean; payload?: {content?: string; error?: string}}>;
```
