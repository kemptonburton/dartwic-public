---
title: "SDK_API::pluginAssetPath"
summary: "Resolve a local bundled Engine plugin file under installation/plugins/id/assets. Plugin updates replace it; save authored changes in workspace assets. Validates paths and may throw."
---

## Declaration

```cpp
std::filesystem::path pluginAssetPath(const std::string& plugin_id, const std::string& relative) {
            pluginWorkspaceAssetPath(plugin_id, relative);
            return installationPath("plugins/" + plugin_id + "/assets/" + relative);
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `plugin_id` | Manifest plugin ID; safe single path segment. |
| `relative` | Validated relative file with an extension; subdirectories are allowed. |

## Returns

Local absolute path. No content read or existence guarantee is implied.
