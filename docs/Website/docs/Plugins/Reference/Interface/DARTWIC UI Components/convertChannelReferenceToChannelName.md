---
title: "convertChannelReferenceToChannelName"
summary: "Converts a value reference such as `|channel|` into its channel name."
---

## Import

```ts
import { convertChannelReferenceToChannelName } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export function convertChannelReferenceToChannelName(value: string) {
    const convert = getHostApi().helpers.convertChannelReferenceToChannelName;
    if (typeof convert !== "function") {
        throw new Error("The interface host does not provide convertChannelReferenceToChannelName.");
    }
    return String(convert(value));
}
```
