---
title: "Plugin Registration"
summary: "Declare an interface plugin and register the UI contributions it provides."
---

| Export | Import path | Description |
| --- | --- | --- |
| [createInterfacePlugin](createInterfacePlugin.md) | `@dartwic/interface-sdk` | Materializes and validates all contributions registered by a plugin. |
| [definePlugin](definePlugin.md) | `@dartwic/interface-sdk` | Defines an interface plugin without registering it in the browser host. |
| [getInterfacePluginContributions](getInterfacePluginContributions.md) | `@dartwic/interface-sdk` | Returns the normalized contribution inventory produced by a plugin. |
| [InterfaceContributionEntry](InterfaceContributionEntry.md) | `@dartwic/interface-sdk/types` | Normalized contribution entry returned for inspection and host integration. |
| [InterfaceContributions](InterfaceContributions.md) | `@dartwic/interface-sdk` | Contributions grouped by supported interface extension point. |
| [InterfacePluginDefinition](InterfacePluginDefinition.md) | `@dartwic/interface-sdk` | Public definition consumed by `definePlugin`. |
| [InterfacePluginRegistrar](InterfacePluginRegistrar.md) | `@dartwic/interface-sdk` | Focused registry supplied to an interface plugin's `register` callback. |
| [MaterializedInterfacePlugin](MaterializedInterfacePlugin.md) | `@dartwic/interface-sdk` | Runtime form of an interface plugin after registration has been evaluated. |
| [NamedContribution](NamedContribution.md) | `@dartwic/interface-sdk/types` | Shared local identity and display name for plugin contributions. |
| [PopupUiDefinition](PopupUiDefinition.md) | `@dartwic/interface-sdk` | A named, host-modal workflow which receives one or more merge-compatible backend requests. |
| [ValueFormatDefinition](ValueFormatDefinition.md) | `@dartwic/interface-sdk/types` | Numeric presentation and editing selected by `format=plugin-id.local-id` in Units. |
