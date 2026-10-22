---
title: "createInterfacePluginAssetClient"
summary: "Read interface/plugins/id/assets using the Interface host installed-plugin file reader. No Engine installation is required."
---

## Import

```ts
import { createInterfacePluginAssetClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createInterfacePluginAssetClient(readPluginFile: (pluginId: string, relative: string) => Promise<string>, pluginId: string): BundledAssetClient;
```
