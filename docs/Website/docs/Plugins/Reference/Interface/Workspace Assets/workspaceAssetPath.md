---
title: workspaceAssetPath
summary: Build a portable assets/namespace/filename reference. Validated single segments, a filename extension and no traversal; throws on invalid input. No I/O.
created: 2026-10-20T18:59
updated: 2026-10-22T02:44
---

## Import

```ts
import { workspaceAssetPath } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function workspaceAssetPath(namespace: string, name: string): string;
```
