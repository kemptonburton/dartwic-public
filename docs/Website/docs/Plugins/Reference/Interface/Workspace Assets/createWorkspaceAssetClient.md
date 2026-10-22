---
title: createWorkspaceAssetClient
summary: Create shared UTF-8/JSON readers and writers. Reads cache per callback; failed reads are evicted. Writes require administrator authority and resolve after the Engine write completes. invalidate evicts external edits. Missing files and invalid JSON reject; no real-time bound.
created: 2026-10-20T18:59
updated: 2026-10-22T03:13
---

## Import

```ts
import { createWorkspaceAssetClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createWorkspaceAssetClient(operation: AssetOperation): WorkspaceAssetClient;
```
