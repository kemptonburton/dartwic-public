---
title: "pluginWorkspaceAssetPath"
summary: "Build assets/plugins/id/relative for shared authored files. Bind the manifest plugin ID; relative files may have validated subdirectories and must have an extension. No I/O or isolation from generic storage APIs."
---

## Import

```ts
import { pluginWorkspaceAssetPath } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function pluginWorkspaceAssetPath(pluginId: string, relative: string): string;
```
