---
title: "Storage"
summary: "Public Interface SDK exports in the Storage category."
---

| Export | Import path | Description |
| --- | --- | --- |
| [createStorageClient](createStorageClient.md) | `@dartwic/interface-sdk` | Create helpers using the host operation callback; existing permissions still apply. |
| [FileReference](FileReference.md) | `@dartwic/interface-sdk/storage` | A named engine root and relative file path. |
| [installationPath](installationPath.md) | `@dartwic/interface-sdk` | Reference an installation file. |
| [instancePath](instancePath.md) | `@dartwic/interface-sdk` | Reference a private engine-instance file. |
| [projectCachePath](projectCachePath.md) | `@dartwic/interface-sdk` | Reference disposable cache data for a named project. |
| [projectPath](projectPath.md) | `@dartwic/interface-sdk` | Reference a portable project file; omission selects the active project. |
| [projectRuntimePath](projectRuntimePath.md) | `@dartwic/interface-sdk` | Reference private runtime data for a named project. |
| [projectSettingsPath](projectSettingsPath.md) | `@dartwic/interface-sdk` | Reference durable private settings for a named project. |
| [SettingsSnapshot](SettingsSnapshot.md) | `@dartwic/interface-sdk/storage` | Effective settings, overrides, leaf sources, and an opaque revision. |
| [StorageClient](StorageClient.md) | `@dartwic/interface-sdk/storage` | Scoped file access and layered workspace/project settings. |
| [workspacePath](workspacePath.md) | `@dartwic/interface-sdk` | Reference a portable workspace file. |
