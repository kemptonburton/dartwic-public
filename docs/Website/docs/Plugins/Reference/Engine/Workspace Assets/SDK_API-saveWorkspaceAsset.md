---
title: "SDK_API::saveWorkspaceAsset"
summary: "Saves a shared text/JSON asset and returns its portable reference. Keep binary data in a base64 package."
---

## Declaration

```cpp
std::string saveWorkspaceAsset(const std::string& node, const std::string& asset_namespace,
                                      const std::string& filename, const std::string& content) {
            const auto path = workspaceAssetPath(asset_namespace, filename);
            callTempest(node, "dartwic/save-file", {{"rootDir", "global_data_directory"}, {"path", path}, {"content", content}});
            return path;
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `node` | Target engine node name. |
| `asset_namespace` | Shared asset namespace. |
| `filename` | Asset filename including extension. |
| `content` | Text or JSON package to save. |

## Returns

Workspace-relative asset reference.
