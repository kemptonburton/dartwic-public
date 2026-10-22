---
title: "cn"
summary: "Combines conditional class values with the host's Tailwind conflict resolution."
---

## Import

```ts
import { cn } from "@dartwic/interface-sdk/utils";
```

## Declaration

```ts
export function cn(...inputs: unknown[]) {
    return getHostApi().sdk.styling.cn(...inputs);
}
```
