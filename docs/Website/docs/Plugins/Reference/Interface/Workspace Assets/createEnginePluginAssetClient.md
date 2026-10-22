---
title: "createEnginePluginAssetClient"
summary: "Read engine/plugins/id/assets through the connected Engine, retaining its authorization. No writes."
---

## Import

```ts
import { createEnginePluginAssetClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createEnginePluginAssetClient(operation: AssetOperation, pluginId: string): BundledAssetClient;
```
