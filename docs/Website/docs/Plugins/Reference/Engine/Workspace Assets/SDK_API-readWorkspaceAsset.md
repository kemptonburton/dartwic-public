---
title: "SDK_API::readWorkspaceAsset"
summary: "Reads a shared text/JSON asset from the selected engine workspace."
---

## Declaration

```cpp
std::string readWorkspaceAsset(const std::string& node, const std::string& asset_namespace, const std::string& filename) {
            return callTempest(node, "dartwic/get-file", {{"rootDir", "global_data_directory"},
                {"filePath", workspaceAssetPath(asset_namespace, filename)}}).at("content").get<std::string>();
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
