---
title: "createInterfacePlugin"
summary: "Materializes and validates all contributions registered by a plugin."
---

## Import

```ts
import { createInterfacePlugin } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createInterfacePlugin(plugin: InterfacePluginDefinition): MaterializedInterfacePlugin {
    return materializePlugin(definePlugin(plugin));
}
```
