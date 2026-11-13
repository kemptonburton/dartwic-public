---
title: Schematic Nodes
summary: Define custom schematic nodes, palette entries, commands, and configuration views.
created: 2026-08-04T17:38
updated: 2026-11-13T00:56
---

| Export | Import path | Description |
| --- | --- | --- |
| [BaseNode](BaseNode.md) | `@dartwic/interface-sdk/schematic-nodes` | Use the host's shared node backend with a custom center. No Engine write occurs during rendering. |
| [BaseNodeConfig](BaseNodeConfig.md) | `@dartwic/interface-sdk/schematic-nodes` | Render the standard shared editor and dedicated sections. |
| [BaseNodeConfigProps](BaseNodeConfigProps.md) | `@dartwic/interface-sdk/schematic-nodes` | Shared Node Setup and Node Appearance editor with optional dedicated tabs. |
| [BaseNodeProps](BaseNodeProps.md) | `@dartwic/interface-sdk/schematic-nodes` | Shared canvas wrapper: labels, rotation/size, handle roles, inspection and alerts. |
| [bindSchematicChannel](bindSchematicChannel.md) | `@dartwic/interface-sdk/schematic-nodes` | Apply built-in channel/title/units and command-feedback pairing rules to node data. Synchronous, no channel write. |
| [createGeneralNodeDefaults](createGeneralNodeDefaults.md) | `@dartwic/interface-sdk/schematic-nodes` | Return fresh General Node defaults. Pure synchronous creation; does not add a canvas node or write files. |
| [defineSchematicNode](defineSchematicNode.md) | `@dartwic/interface-sdk/schematic-nodes` | Defines a schematic node renderer and its editing behavior. |
| [defineSchematicNodePreset](defineSchematicNodePreset.md) | `@dartwic/interface-sdk/schematic-nodes` | Define serializable initial data for registration with addSchematicNodePreset. No filesystem writes. |
| [GeneralNode](GeneralNode.md) | `@dartwic/interface-sdk/schematic-nodes` | Render the configurable General Node, including readout, command, shape and media building blocks. |
| [GeneralNodeConfig](GeneralNodeConfig.md) | `@dartwic/interface-sdk/schematic-nodes` | Edit General Node using the same tabs and mixed-selection behavior as built-ins. |
| [NodeReadoutLayout](NodeReadoutLayout.md) | `@dartwic/interface-sdk/schematic-nodes` | Shared glyph/card center layout, including table and authority chrome. |
| [NodeSettingsDetails](NodeSettingsDetails.md) | `@dartwic/interface-sdk/schematic-nodes` | Standard collapsible node configuration group. |
| [NodeSettingsField](NodeSettingsField.md) | `@dartwic/interface-sdk/schematic-nodes` | Searchable, mixed-value-aware entry in a node configuration section. |
| [NodeSettingsFieldProps](NodeSettingsFieldProps.md) | `@dartwic/interface-sdk/schematic-nodes` | A searchable configuration entry; settingPath enables shared selection editing and mixed values. |
| [NodeSettingsSection](NodeSettingsSection.md) | `@dartwic/interface-sdk/schematic-nodes` | Standard wrapping group of configuration entries. |
| [NodeSettingsToggle](NodeSettingsToggle.md) | `@dartwic/interface-sdk/schematic-nodes` | Searchable, mixed-value-aware switch in a node configuration section. |
| [NodeValueSource](NodeValueSource.md) | `@dartwic/interface-sdk/schematic-nodes` | Shared configurable-input / If Else source editor. |
| [normalizeGeneralNode](normalizeGeneralNode.md) | `@dartwic/interface-sdk/schematic-nodes` | Normalize a saved legacy node without changing its identity or attachments. Synchronous, no persistence. |
| [ReadoutContent](ReadoutContent.md) | `@dartwic/interface-sdk/schematic-nodes` | Shared title, value, units, gauge/bar and sparkline presentation. |
| [SchematicChannelBinding](SchematicChannelBinding.md) | `@dartwic/interface-sdk/schematic-nodes` | Synchronous data patch only; must not write channel values or perform I/O. |
| [SchematicChannelDropContext](SchematicChannelDropContext.md) | `@dartwic/interface-sdk/schematic-nodes` | Metadata supplied for channel insertion and existing-node drops. |
| [SchematicCommandAction](SchematicCommandAction.md) | `@dartwic/interface-sdk/schematic-nodes` | Operator command exposed by a schematic node. |
| [SchematicCommandContext](SchematicCommandContext.md) | `@dartwic/interface-sdk/schematic-nodes` | Runtime context supplied while building node command actions. |
| [SchematicConnectionPort](SchematicConnectionPort.md) | `@dartwic/interface-sdk/schematic-nodes` | Stable normalized connection coordinate and outward edge direction. |
| [SchematicFluidPath](SchematicFluidPath.md) | `@dartwic/interface-sdk/schematic-nodes` | One independent passive fluid relay group. IDs remain stable when paths are renamed or reordered. |
| [SchematicHandleRole](SchematicHandleRole.md) | `@dartwic/interface-sdk/schematic-nodes` | Saved handle behavior. Roles describe activity propagation, not edge direction. |
| [SchematicNodeConfigProps](SchematicNodeConfigProps.md) | `@dartwic/interface-sdk/schematic-nodes` | Props passed to a schematic node configuration component. |
| [SchematicNodeConfigSection](SchematicNodeConfigSection.md) | `@dartwic/interface-sdk/schematic-nodes` | Dedicated custom-content tab appended to the shared node editor. |
| [SchematicNodeContributionDefinition](SchematicNodeContributionDefinition.md) | `@dartwic/interface-sdk` | Registers a schematic node under a plugin-qualified type. |
| [SchematicNodeData](SchematicNodeData.md) | `@dartwic/interface-sdk/schematic-nodes` | Saved node data; custom fields are retained by normal editing and persistence. |
| [SchematicNodeDefinition](SchematicNodeDefinition.md) | `@dartwic/interface-sdk/schematic-nodes` | Complete renderer, editor, palette, sizing, and command contract for a node type. |
| [SchematicNodePaletteDefinition](SchematicNodePaletteDefinition.md) | `@dartwic/interface-sdk/schematic-nodes` | Palette label and default node data for a schematic contribution. |
| [SchematicNodePresetDefinition](SchematicNodePresetDefinition.md) | `@dartwic/interface-sdk/schematic-nodes` | Named data-only browser, Insert Node and gallery contribution. Use type general for shared building blocks. |
| [SchematicNodeProps](SchematicNodeProps.md) | `@dartwic/interface-sdk/schematic-nodes` | Props passed to the canvas renderer for one schematic node. |
| [SchematicNodeRecord](SchematicNodeRecord.md) | `@dartwic/interface-sdk/schematic-nodes` | Serializable node instance or preset, independent of its renderer. |
