---
title: DARTWIC UI Components
summary: Use higher-level components that follow DARTWIC interaction and styling conventions.
created: 2026-08-04T17:38
updated: 2026-10-21T15:16
---

| Export | Import path | Description |
| --- | --- | --- |
| [AbstractedButtonNodeConfig](AbstractedButtonNodeConfig.md) | `@dartwic/interface-sdk/ui` | Configure an abstracted schematic button node. |
| [buildChannelFieldPayload](buildChannelFieldPayload.md) | `@dartwic/interface-sdk/ui` | Build a channel-field payload from a value reference and optional field. |
| [buildControlDisplayNodeDefinitionFromChannel](buildControlDisplayNodeDefinitionFromChannel.md) | `@dartwic/interface-sdk/ui` | Create a control-display schematic node definition from channel data. |
| [buildParameterDisplayNodeDefinitionFromChannel](buildParameterDisplayNodeDefinitionFromChannel.md) | `@dartwic/interface-sdk/ui` | Create a parameter-display schematic node definition from channel data. |
| [ChannelComboBox](ChannelComboBox.md) | `@dartwic/interface-sdk/ui` | Selects a DARTWIC channel and, optionally, one of its fields. |
| [ChannelComboBoxProps](ChannelComboBoxProps.md) | `@dartwic/interface-sdk/ui` | Props for the host channel and field selector. |
| [ComboboxSearch](ComboboxSearch.md) | `@dartwic/interface-sdk/ui` | Searches a fixed option list using DARTWIC's standard host-owned combobox. |
| [ComboboxSearchItem](ComboboxSearchItem.md) | `@dartwic/interface-sdk/ui` | One searchable option displayed by the host-owned combobox. |
| [ComboboxSearchProps](ComboboxSearchProps.md) | `@dartwic/interface-sdk/ui` | Props for the standard host-owned searchable list selector. |
| [ConfigurableInput](ConfigurableInput.md) | `@dartwic/interface-sdk/ui` | Edits a configurable literal, channel reference, or expression value. |
| [ConfigurableInputProps](ConfigurableInputProps.md) | `@dartwic/interface-sdk/ui` | Props for editing a serialized configurable-input expression. |
| [ConsoleAlert](ConsoleAlert.md) | `@dartwic/interface-sdk/ui` | Display an alert in the host console presentation. |
| [ConsoleAlertProps](ConsoleAlertProps.md) | `@dartwic/interface-sdk/ui` | Links active ARGUS alerts for the supplied channels. |
| [convertChannelReferenceToChannelName](convertChannelReferenceToChannelName.md) | `@dartwic/interface-sdk/ui` | Converts a value reference such as `\|channel\|` into its channel name. |
| [EmbeddedRemoteView](EmbeddedRemoteView.md) | `@dartwic/interface-sdk/ui` | Embed a remote engine view using the host component. |
| [EmbeddedRemoteViewProps](EmbeddedRemoteViewProps.md) | `@dartwic/interface-sdk/ui` | Remote view embedded in a plugin resource or schematic. |
| [EmbeddedSchematicNode](EmbeddedSchematicNode.md) | `@dartwic/interface-sdk/ui` | Embed a schematic node using the host component. |
| [EmbeddedSchematicNodeProps](EmbeddedSchematicNodeProps.md) | `@dartwic/interface-sdk/ui` | One remote schematic node embedded in a plugin view. |
| [getChannelValueFromChannels](getChannelValueFromChannels.md) | `@dartwic/interface-sdk/ui` | Resolve a value reference against a channel-data map. |
| [getParticipantAccentColor](getParticipantAccentColor.md) | `@dartwic/interface-sdk/ui` | Return the host accent color assigned to a client identity. |
| [IfElseBlock](IfElseBlock.md) | `@dartwic/interface-sdk/ui` | Edit conditional branch configuration with the host component. |
| [ifElseBlockCheck](ifElseBlockCheck.md) | `@dartwic/interface-sdk/ui` | Evaluate conditional block data against supplied channel values. |
| [IfElseBlockProps](IfElseBlockProps.md) | `@dartwic/interface-sdk/ui` | Edits a conditional configuration block. |
| [ManualRefreshButton](ManualRefreshButton.md) | `@dartwic/interface-sdk/ui` | Renders the standard refresh icon button with an in-progress state. |
| [ManualRefreshButtonProps](ManualRefreshButtonProps.md) | `@dartwic/interface-sdk/ui` | Props for the standard refresh icon button. |
| [ModuleConnectionStatus](ModuleConnectionStatus.md) | `@dartwic/interface-sdk/ui` | Renders the shared live connection indicator for an opted-in module. |
| [ModuleConnectionStatusProps](ModuleConnectionStatusProps.md) | `@dartwic/interface-sdk/ui` | Props for the shared opt-in module connection indicator. |
| [ModuleInstanceConnection](ModuleInstanceConnection.md) | `@dartwic/interface-sdk/ui` | Renders the standard task-detail module selector, resource link, and live connection state. |
| [ModuleInstanceConnectionProps](ModuleInstanceConnectionProps.md) | `@dartwic/interface-sdk/ui` | Shared module selector, module link, and opt-in live connection status. |
| [ModuleInstanceSelect](ModuleInstanceSelect.md) | `@dartwic/interface-sdk/ui` | Selects only module instances owned by the requested plugin and compatible module types. |
| [ModuleInstanceSelectProps](ModuleInstanceSelectProps.md) | `@dartwic/interface-sdk/ui` | Props for selecting a live module instance compatible with a plugin task. |
| [ModuleRuntimeChannel](ModuleRuntimeChannel.md) | `@dartwic/interface-sdk/ui` | One live channel rendered beneath a linked module task. |
| [ModuleRuntimeOverview](ModuleRuntimeOverview.md) | `@dartwic/interface-sdk/ui` | Shows linked tasks, state, channels and measured frequency. Start, Stop and Hold require a connected administrator and two clicks within four seconds; rebuilding disables them. Writes request changes asynchronously; live telemetry reports state separately. |
| [ModuleRuntimeOverviewProps](ModuleRuntimeOverviewProps.md) | `@dartwic/interface-sdk/ui` | Props for the standard linked-task, status, and channel overview on module pages. |
| [normalizeLegacyChannelFieldReference](normalizeLegacyChannelFieldReference.md) | `@dartwic/interface-sdk/ui` | Normalize a legacy channel and field reference using host rules. |
| [ResourceParticipantsIcon](ResourceParticipantsIcon.md) | `@dartwic/interface-sdk/ui` | Show the participants associated with a resource. |
| [ResourceStatusIconProps](ResourceStatusIconProps.md) | `@dartwic/interface-sdk/ui` | Resource identity for the host presence and sync status icons. |
| [ResourceSyncStatusIcon](ResourceSyncStatusIcon.md) | `@dartwic/interface-sdk/ui` | Show resource synchronization status. |
| [StaleChannelsTooltip](StaleChannelsTooltip.md) | `@dartwic/interface-sdk/ui` | Display details about stale channel data. |
| [StaleChannelsTooltipProps](StaleChannelsTooltipProps.md) | `@dartwic/interface-sdk/ui` | Shows stale or missing channel context. |
| [TaskBinding](TaskBinding.md) | `@dartwic/interface-sdk/ui` | One editable row in the standard task channel-binding table. |
| [TaskBindingTable](TaskBindingTable.md) | `@dartwic/interface-sdk/ui` | Renders the standard editable task channel-binding table. |
| [TaskBindingTableProps](TaskBindingTableProps.md) | `@dartwic/interface-sdk/ui` | Standard task binding table shared by plugin task editors. |
