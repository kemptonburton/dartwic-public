---
title: "useIfElseBlock"
summary: "Evaluate an if/else block using the host live-data hook."
---

## Import

```ts
import { useIfElseBlock } from "@dartwic/interface-sdk/hooks";
```

## Declaration

```ts
export function useIfElseBlock(data: Record<string, unknown>) {
    return callHostHook("useIfElseBlock", [data]);
}
```
