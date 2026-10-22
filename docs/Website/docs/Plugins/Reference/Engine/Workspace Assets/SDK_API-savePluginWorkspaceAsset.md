---
title: "SDK_API::savePluginWorkspaceAsset"
summary: "Synchronously save shared authored plugin data. Requires administrator authority. Project settings and local secrets/runtime retain their scopes. May block and throw."
---

## Declaration

```cpp
std::string savePluginWorkspaceAsset(const std::string& node, const std::string& plugin_id, const std::string& relative, const std::string& content) {
            const auto path = pluginWorkspaceAssetPath(plugin_id, relative);
            callTempest(node, "dartwic/save-file", {{"rootDir", "workspace_assets_directory"}, {"path", path.substr(7)}, {"content", content}});
            return path;
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `node` | Target Engine node name, local or connected peer. |
| `plugin_id` | Manifest plugin ID; safe single path segment. |
| `relative` | Validated relative file with an extension; subdirectories are allowed. |
| `content` | UTF-8 text or serialized JSON; binary content needs a text package. |

## Returns

Portable assets/plugins/id/relative reference after the Engine write completes.
