---
title: "createPluginWorkspaceAssetClient"
summary: "Bind authored-file helpers once to a validated manifest plugin ID. Completion means the Engine operation finished; I/O may block without a real-time bound."
---

## Import

```ts
import { createPluginWorkspaceAssetClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createPluginWorkspaceAssetClient(operation: AssetOperation, pluginId: string): PluginWorkspaceAssetClient;
```
