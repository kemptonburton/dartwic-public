---
title: "useChannelDropTarget"
summary: "Register a handler for channel drops with optional host drop-target settings."
---

## Import

```ts
import { useChannelDropTarget } from "@dartwic/interface-sdk/hooks";
```

## Declaration

```ts
export function useChannelDropTarget(handler: (payload: unknown) => void, options?: Record<string, unknown>) {
    return callHostHook("useChannelDropTarget", [handler, options]);
}
```
