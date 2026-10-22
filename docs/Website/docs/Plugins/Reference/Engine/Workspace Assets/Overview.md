---
title: Workspace Assets
summary: Public Engine SDK declarations in the Workspace Assets category.
created: 2026-10-20T18:59
updated: 2026-10-22T02:44
---

| Declaration | Description |
| --- | --- |
| [SDK_API::pluginAssetPath](SDK_API-pluginAssetPath.md) | Resolve a local bundled Engine plugin file under installation/plugins/id/assets. |
| [pluginWorkspaceAssetPath](pluginWorkspaceAssetPath.md) | Portable assets/plugins/id/relative reference for authored shared plugin files. Bind the manifest's plugin ID. Validates segments and requires a file extension. No I/O or isolation from generic storage APIs. |
| [SDK_API::readPluginWorkspaceAsset](SDK_API-readPluginWorkspaceAsset.md) | Synchronously read authored UTF-8 data from workspace/assets/plugins/id/relative. |
| [SDK_API::readWorkspaceAsset](SDK_API-readWorkspaceAsset.md) | Reads a shared text/JSON asset from the selected engine workspace. |
| [SDK_API::savePluginWorkspaceAsset](SDK_API-savePluginWorkspaceAsset.md) | Synchronously save shared authored plugin data. Requires administrator authority. |
| [SDK_API::saveWorkspaceAsset](SDK_API-saveWorkspaceAsset.md) | Saves a shared text/JSON asset and returns its portable reference. Keep binary data in a base64 package. |
| [workspaceAssetPath](workspaceAssetPath.md) | Portable assets/namespace/filename reference below the workspace root. Validated single segments with a filename extension; throws invalid_argument on unsafe names. No I/O. |
