---
title: SDK_API::saveWorkspaceAsset
summary: Saves a shared text/JSON asset and returns its portable reference. Keep binary data in a base64 package.
created: 2026-10-20T18:59
updated: 2026-10-22T02:44
---

## Declaration

```cpp
std::string saveWorkspaceAsset(const std::string& node, const std::string& asset_namespace,
                                      const std::string& filename, const std::string& content) {
            const auto path = workspaceAssetPath(asset_namespace, filename);
            callTempest(node, "dartwic/save-file", {{"rootDir", "workspace_assets_directory"}, {"path", path.substr(7)}, {"content", content}});
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
