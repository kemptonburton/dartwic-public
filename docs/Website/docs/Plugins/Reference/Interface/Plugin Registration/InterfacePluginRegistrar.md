---
title: InterfacePluginRegistrar
summary: Focused registry supplied to an interface plugin's `register` callback.
created: 2026-08-04T17:38
updated: 2026-11-13T00:56
---

## Import

```ts
import type { InterfacePluginRegistrar } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface InterfacePluginRegistrar {
    addValueFormat(definition: ValueFormatDefinition): string;
    addTaskUi(definition: TaskUiDefinition): string;
    addModuleUi(definition: ModuleUiDefinition): string;
    addResource(definition: ResourceContributionDefinition): string;
    addSchematicNode(definition: SchematicNodeContributionDefinition): string;
    /** Add a data-only preset to the node browser, Insert Node and gallery. Returns its plugin-qualified id. */
    addSchematicNodePreset(definition: SchematicNodePresetDefinition): string;
    addSettingsPanel(definition: SettingsPanelDefinition): string;
    addPopupUi(definition: PopupUiDefinition): string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `addValueFormat` | `string` | Required |  |
| `addTaskUi` | `string` | Required |  |
| `addModuleUi` | `string` | Required |  |
| `addResource` | `string` | Required |  |
| `addSchematicNode` | `string` | Required |  |
| `addSchematicNodePreset` | `string` | Required | Add a data-only preset to the node browser, Insert Node and gallery. Returns its plugin-qualified id. |
| `addSettingsPanel` | `string` | Required |  |
| `addPopupUi` | `string` | Required |  |
