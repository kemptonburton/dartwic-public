---
title: Config Map
summary: Public Interface SDK exports in the Config Map category.
created: 2026-10-25T12:50
updated: 2026-10-26T19:16
---

| Export | Import path | Description |
| --- | --- | --- |
| [ConfigMap](ConfigMap.md) | `@dartwic/interface-sdk/config-maps` | Host configuration table with connection-scoped shared drafts and serialized application through its adapter. Standalone text commits on Enter; registered module/task sheets use Apply and plugin settings save on blur. Requires a host exposing ConfigMap. |
| [ConfigMapDefinition](ConfigMapDefinition.md) | `@dartwic/interface-sdk/config-maps` | A single declaration shared by resource editors and Module Map, without another persistent configuration store. |
| [ConfigMapField](ConfigMapField.md) | `@dartwic/interface-sdk/config-maps` | One reusable cell. Standalone editors commit text/numbers on Enter and selections immediately; resource sheets use Apply, while plugin settings save on blur. Validation is synchronous; persistence and device application belong to the adapter. |
| [ConfigMapProps](ConfigMapProps.md) | `@dartwic/interface-sdk/config-maps` | Props for session-shared configuration editing; resourceKey must uniquely identify one resource within a connection. |
| [ConfigMapTable](ConfigMapTable.md) | `@dartwic/interface-sdk/config-maps` | Repeatable hardware/channel bindings. New rows are local drafts until required cells are committed. |
| [createModuleConfigAdapter](createModuleConfigAdapter.md) | `@dartwic/interface-sdk/config-maps` | Use the existing module JSON resource and detached save/reload job. Completion includes reload/rebinding and a fresh read; failures reject, and timeouts require observation before retry. No new storage is created. Configuration-time I/O only. |
| [createTaskConfigAdapter](createTaskConfigAdapter.md) | `@dartwic/interface-sdk/config-maps` | Edit an existing task through the Engine's configuration/recovery path with expected-argument conflict detection. Preserve metadata; the Engine owns running/hold restoration. Resolve after application and a fresh observation, or reject. No new storage is created. |
| [defineConfigMap](defineConfigMap.md) | `@dartwic/interface-sdk/config-maps` | Defines optional configuration metadata without creating or changing resources. |
| [getConfigMapChannels](getConfigMapChannels.md) | `@dartwic/interface-sdk/config-maps` | Derives channel trace rows from declared channel fields and binding columns, for ModuleRuntimeOverview or custom summaries. channelMode write means a device input published to RAPID; read means a RAPID command consumed by the device. |
