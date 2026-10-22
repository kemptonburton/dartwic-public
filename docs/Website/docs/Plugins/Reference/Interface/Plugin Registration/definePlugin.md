---
title: "definePlugin"
summary: "Defines an interface plugin without registering it in the browser host."
---

## Import

```ts
import { definePlugin } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function definePlugin(plugin: InterfacePluginDefinition): InterfacePluginDefinition {
    if (!plugin || typeof plugin !== "object") {
        throw new Error("definePlugin(...) requires a plugin definition.");
    }
    return plugin;
}
```
