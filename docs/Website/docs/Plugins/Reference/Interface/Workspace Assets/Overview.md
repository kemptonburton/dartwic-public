---
title: Workspace Assets
summary: Public Interface SDK exports in the Workspace Assets category.
created: 2026-10-20T18:59
updated: 2026-10-22T03:13
---

| Export | Import path | Description |
| --- | --- | --- |
| [AssetOperation](AssetOperation.md) | `@dartwic/interface-sdk/assets` | Engine operation callback used by asset helpers. |
| [BundledAssetClient](BundledAssetClient.md) | `@dartwic/interface-sdk/assets` | Read-only bundled UTF-8/JSON files. Updates replace them. Missing files and invalid JSON reject; no caching or real-time bound. |
| [createBundledPluginAssetClient](createBundledPluginAssetClient.md) | `@dartwic/interface-sdk` | Read files shipped in this Interface plugin's assets folder. Call after runtime registration, passing the manifest ID. Resolves the current host adapter automatically. Read-only UTF-8/JSON; updates replace the files. Missing files, invalid paths and invalid JSON reject. |
| [createEnginePluginAssetClient](createEnginePluginAssetClient.md) | `@dartwic/interface-sdk` | Read engine/plugins/id/assets through the connected Engine, retaining its authorization. No writes. |
| [createInterfacePluginAssetClient](createInterfacePluginAssetClient.md) | `@dartwic/interface-sdk` | Read interface/plugins/id/assets using the Interface host installed-plugin file reader. No Engine installation is required. |
| [createPluginWorkspaceAssetClient](createPluginWorkspaceAssetClient.md) | `@dartwic/interface-sdk` | Bind authored-file helpers once to a validated manifest plugin ID. Completion means the Engine operation finished; I/O may block without a real-time bound. |
| [createWorkspaceAssetClient](createWorkspaceAssetClient.md) | `@dartwic/interface-sdk` | Create shared UTF-8/JSON readers and writers. Reads cache per callback; failed reads are evicted. Writes require administrator authority and resolve after the Engine write completes. invalidate evicts external edits. Missing files and invalid JSON reject; no real-time bound. |
| [PluginWorkspaceAssetClient](PluginWorkspaceAssetClient.md) | `@dartwic/interface-sdk/assets` | Authored plugin files confined by these helpers to workspace/assets/plugins/id. Project settings, secrets and runtime retain their scopes. |
| [pluginWorkspaceAssetPath](pluginWorkspaceAssetPath.md) | `@dartwic/interface-sdk` | Build assets/plugins/id/relative for shared authored files. Bind the manifest plugin ID; relative files may have validated subdirectories and must have an extension. No I/O or isolation from generic storage APIs. |
| [validateWorkspaceAssetPath](validateWorkspaceAssetPath.md) | `@dartwic/interface-sdk/assets` | Validate and normalize a shared asset path. |
| [WORKSPACE_ASSET_ROOT](WORKSPACE_ASSET_ROOT.md) | `@dartwic/interface-sdk` | Named root containing shared workspace assets. |
| [WorkspaceAssetClient](WorkspaceAssetClient.md) | `@dartwic/interface-sdk/assets` | Shared authored UTF-8/JSON file operations. Stored paths are workspace-relative assets/... references. |
| [workspaceAssetPath](workspaceAssetPath.md) | `@dartwic/interface-sdk` | Build a portable assets/namespace/filename reference. Validated single segments, a filename extension and no traversal; throws on invalid input. No I/O. |
