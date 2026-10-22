---
title: "useChannelStatusNames"
summary: "Read status names for the supplied channel value paths."
---

## Import

```ts
import { useChannelStatusNames } from "@dartwic/interface-sdk/hooks";
```

## Declaration

```ts
export function useChannelStatusNames(channelValuePaths: string[]) {
    return callHostHook("useChannelStatusNames", [channelValuePaths]);
}
```
