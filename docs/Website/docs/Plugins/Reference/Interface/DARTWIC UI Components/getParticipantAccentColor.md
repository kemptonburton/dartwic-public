---
title: "getParticipantAccentColor"
summary: "Return the host accent color assigned to a client identity."
---

## Import

```ts
import { getParticipantAccentColor } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export function getParticipantAccentColor(clientId: string) {
    const helper = getHostApi().helpers.getParticipantAccentColor;
    if (typeof helper !== "function") {
        throw new Error("The interface host does not provide getParticipantAccentColor.");
    }
    return String(helper(clientId));
}
```
