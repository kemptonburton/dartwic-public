---
title: "useResourceParticipantVisibility"
summary: "Controls whether remote participants are shown for a resource."
---

## Import

```ts
import { useResourceParticipantVisibility } from "@dartwic/interface-sdk/hooks";
```

## Declaration

```ts
export function useResourceParticipantVisibility(resourceName: string, resourcePath: string) {
    return callHostHook("useResourceParticipantVisibility", [resourceName, resourcePath]);
}
```
