---
title: "PluginSettingsProps"
summary: "Props passed to a plugin settings component."
---

## Import

```ts
import type { PluginSettingsProps } from "@dartwic/interface-sdk/plugin-settings";
```

## Declaration

```ts
export interface PluginSettingsProps {
    operation?: (...args: any[]) => Promise<any>;
    plugin?: any;
    pluginGroup?: any;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `operation` | `(...args: any[]) => Promise<any>` | Optional |  |
| `plugin` | `any` | Optional |  |
| `pluginGroup` | `any` | Optional |  |
