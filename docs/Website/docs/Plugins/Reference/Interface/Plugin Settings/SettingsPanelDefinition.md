---
title: SettingsPanelDefinition
summary: Registers a plugin settings panel.
created: 2026-08-04T17:38
updated: 2026-10-25T20:52
---

## Import

```ts
import type { SettingsPanelDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface SettingsPanelDefinition extends NamedContribution {
    /** Optional shared document declaration. An explicit component can interleave custom UI and ConfigMap group views. */
    configMap?: ConfigMapDefinition;
    component?: PluginSettingsDefinition["component"];
    /** Host normalization metadata; set by the registrar for an explicit component with configMap. */
    customConfigMapLayout?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `configMap` | `ConfigMapDefinition` | Optional | Optional shared document declaration. An explicit component can interleave custom UI and ConfigMap group views. |
| `component` | `PluginSettingsDefinition["component"]` | Optional |  |
| `customConfigMapLayout` | `boolean` | Optional | Host normalization metadata; set by the registrar for an explicit component with configMap. |
