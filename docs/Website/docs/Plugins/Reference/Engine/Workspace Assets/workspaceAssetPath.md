---
title: workspaceAssetPath
summary: Portable assets/namespace/filename reference below the workspace root. Validated single segments with a filename extension; throws invalid_argument on unsafe names. No I/O.
created: 2026-10-20T18:59
updated: 2026-10-22T03:13
---

## Declaration

```cpp
inline std::string workspaceAssetPath(const std::string& asset_namespace, const std::string& filename) {
        const auto safe_segment = [](const std::string& value) {
            if (value.empty() || value.find("..") != std::string::npos || value.back() == '.') return false;
            const auto alphanumeric = [](char c) {return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');};
            if (!alphanumeric(value.front())) return false;
            for (char c : value) if (!alphanumeric(c) && c != '_' && c != '-' && c != '.') return false;
            return true;
        };
        if (!safe_segment(asset_namespace) || !safe_segment(filename) || filename.find('.') == std::string::npos)
            throw std::invalid_argument("Asset namespace and filename must be safe path segments, with a file extension.");
        return "assets/" + asset_namespace + "/" + filename;
    }
```
