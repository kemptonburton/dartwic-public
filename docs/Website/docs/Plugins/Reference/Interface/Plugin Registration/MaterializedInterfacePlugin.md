---
title: MaterializedInterfacePlugin
summary: Runtime form of an interface plugin after registration has been evaluated.
created: 2026-08-04T17:38
updated: 2026-11-13T00:56
---

## Import

```ts
import type { MaterializedInterfacePlugin } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface MaterializedInterfacePlugin {
    valueFormats: Record<string, ValueFormatDefinition>;
    id: string;
    name: string;
    taskTypes: string[];
    taskCards: Record<string, TaskCardDefinition>;
    taskEditors: Record<string, TaskConfigDefinition>;
    moduleUis: Record<string, ModuleUiDefinition>;
    resources: ResourceDefinition[];
    schematicNodes: SchematicNodeDefinition[];
    schematicNodePresets?: SchematicNodePresetDefinition[];
    settingsPanels: SettingsPanelDefinition[];
    popupUis: Record<string, PopupUiDefinition>;
    contributions: {interface: InterfaceContributions};
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `valueFormats` | `Record<string, ValueFormatDefinition>` | Required |  |
| `id` | `string` | Required |  |
| `name` | `string` | Required |  |
| `taskTypes` | `string[]` | Required |  |
| `taskCards` | `Record<string, TaskCardDefinition>` | Required |  |
| `taskEditors` | `Record<string, TaskConfigDefinition>` | Required |  |
| `moduleUis` | `Record<string, ModuleUiDefinition>` | Required |  |
| `resources` | `ResourceDefinition[]` | Required |  |
| `schematicNodes` | `SchematicNodeDefinition[]` | Required |  |
| `schematicNodePresets` | `SchematicNodePresetDefinition[]` | Optional |  |
| `settingsPanels` | `SettingsPanelDefinition[]` | Required |  |
| `popupUis` | `Record<string, PopupUiDefinition>` | Required |  |
| `contributions` | `{interface: InterfaceContributions}` | Required |  |
