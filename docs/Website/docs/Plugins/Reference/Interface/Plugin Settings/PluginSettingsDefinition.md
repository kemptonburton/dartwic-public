---
title: "PluginSettingsDefinition"
summary: "Component registered as a plugin settings panel."
---

## Import

```ts
import type { PluginSettingsDefinition } from "@dartwic/interface-sdk/plugin-settings";
```

## Declaration

```ts
export interface PluginSettingsDefinition {
    component: (props: PluginSettingsProps) => any;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `component` | `(props: PluginSettingsProps) => any` | Required |  |
