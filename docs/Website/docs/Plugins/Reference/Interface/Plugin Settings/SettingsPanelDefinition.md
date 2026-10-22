---
title: "SettingsPanelDefinition"
summary: "Registers a plugin settings panel."
---

## Import

```ts
import type { SettingsPanelDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface SettingsPanelDefinition extends NamedContribution {
    component: PluginSettingsDefinition["component"];
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `component` | `PluginSettingsDefinition["component"]` | Required |  |
