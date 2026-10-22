---
title: "useRemoteTempest"
summary: "Lists remote TEMPEST nodes, operations, and pins and calls peer commands."
---

## Import

```ts
import { useRemoteTempest } from "@dartwic/interface-sdk/hooks";
```

## Declaration

```ts
export function useRemoteTempest() {
    return callHostHook("useRemoteTempest") as {
        listNodes(): Promise<Record<string, unknown>[]>;
        listOperations(node: string): Promise<Record<string, unknown>[]>;
        listPinnedCommands(node: string, peerId: string): Promise<Record<string, unknown>[]>;
        call(node: string, operation: string, args?: Record<string, unknown>): Promise<Record<string, unknown>>;
        callPinned(node: string, preset: string, overrides?: Record<string, unknown>): Promise<Record<string, unknown>>;
    };
}
```
