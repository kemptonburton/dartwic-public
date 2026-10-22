---
title: "createStorageClient"
summary: "Create helpers using the host operation callback; existing permissions still apply."
---

## Import

```ts
import { createStorageClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createStorageClient(operation: (name: string, payload: any) => Promise<any>): StorageClient;
```
