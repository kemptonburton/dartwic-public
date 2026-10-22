---
title: "createBundledPluginAssetClient"
summary: "Read files shipped in this Interface plugin's assets folder. Call after runtime registration, passing the manifest ID. Resolves the current host adapter automatically. Read-only UTF-8/JSON; updates replace the files. Missing files, invalid paths and invalid JSON reject."
---

## Import

```ts
import { createBundledPluginAssetClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createBundledPluginAssetClient(pluginId: string): BundledAssetClient {
    return createBundledReader(getHostApi().readPluginFile, pluginId);
}
```
