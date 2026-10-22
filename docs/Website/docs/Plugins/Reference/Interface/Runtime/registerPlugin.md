---
title: registerPlugin
summary: Registers an interface plugin definition with the browser plugin host.
created: 2026-08-04T17:38
updated: 2026-10-12T14:00
---

## Import

```ts
import { registerPlugin } from "@dartwic/interface-sdk/runtime";
```

## Declaration

```ts
export function registerPlugin(pluginDefinition: InterfacePluginDefinition) {
    const plugin = definePlugin(pluginDefinition);
    const pluginId = String(plugin?.id ?? "").trim();

    if (!pluginId) {
        throw new Error("registerPlugin(...) requires a plugin definition with an id.");
    }

    const registry = (window.__dartwicPluginRegistry__ = window.__dartwicPluginRegistry__ || {});
    registry[pluginId] = {
        internalHostVersion: INTERFACE_PLUGIN_HOST_VERSION,
        createPlugin(hostApi: InterfacePluginHostApi) {
            setHostApi(hostApi);
            return createInterfacePlugin(plugin);
        }
    };
}
```
