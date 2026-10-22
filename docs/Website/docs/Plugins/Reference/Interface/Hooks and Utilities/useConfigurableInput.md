---
title: "useConfigurableInput"
summary: "Evaluate serialized configurable-input state through the host hook."
---

## Import

```ts
import { useConfigurableInput } from "@dartwic/interface-sdk/hooks";
```

## Declaration

```ts
export function useConfigurableInput(data: Record<string, unknown>) {
    return callHostHook("useConfigurableInput", [data]);
}
```
