---
title: "getInterfacePluginContributions"
summary: "Returns the normalized contribution inventory produced by a plugin."
---

## Import

```ts
import { getInterfacePluginContributions } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function getInterfacePluginContributions(plugin: InterfacePluginDefinition): {interface: InterfaceContributions} {
    return createInterfacePlugin(plugin).contributions;
}
```
