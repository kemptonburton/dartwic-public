---
title: "InterfacePluginRegistrar"
summary: "Focused registry supplied to an interface plugin's `register` callback."
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
| `addSettingsPanel` | `string` | Required |  |
| `addPopupUi` | `string` | Required |  |
