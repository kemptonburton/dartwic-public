---
title: "SDK_API::readPluginWorkspaceAsset"
summary: "Synchronously read authored UTF-8 data from workspace/assets/plugins/id/relative. Missing files, authorization and transport failures throw. May block; no real-time bound."
---

## Declaration

```cpp
std::string readPluginWorkspaceAsset(const std::string& node, const std::string& plugin_id, const std::string& relative) {
            return callTempest(node, "dartwic/get-file", {{"rootDir", "workspace_assets_directory"}, {"filePath", pluginWorkspaceAssetPath(plugin_id, relative).substr(7)}}).at("content").get<std::string>();
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `node` | Target Engine node name, local or connected peer. |
| `plugin_id` | Manifest plugin ID; safe single path segment. |
| `relative` | Validated relative file with an extension; subdirectories are allowed. |

## Returns

UTF-8 file content after the remote read completes.
