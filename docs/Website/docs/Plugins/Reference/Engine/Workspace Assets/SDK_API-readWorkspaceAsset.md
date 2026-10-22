---
title: SDK_API::readWorkspaceAsset
summary: Reads a shared text/JSON asset from the selected engine workspace.
created: 2026-10-20T18:59
updated: 2026-10-22T02:44
---

## Declaration

```cpp
std::string readWorkspaceAsset(const std::string& node, const std::string& asset_namespace, const std::string& filename) {
            return callTempest(node, "dartwic/get-file", {{"rootDir", "workspace_assets_directory"},
                {"filePath", workspaceAssetPath(asset_namespace, filename).substr(7)}}).at("content").get<std::string>();
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `node` | Target engine node name. |
| `asset_namespace` | Shared asset namespace. |
| `filename` | Asset filename including extension. |

## Returns

Text content of the asset.
