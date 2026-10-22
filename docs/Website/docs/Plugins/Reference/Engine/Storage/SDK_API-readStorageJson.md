---
title: "SDK_API::readStorageJson"
summary: "Reads JSON below a storage root."
---

## Declaration

```cpp
virtual nlohmann::json readStorageJson(const std::string& scope, const std::string& path,
            const nlohmann::json& missing = nullptr, const std::string& project = "") {
            throw std::runtime_error("JSON storage helpers are unavailable in this host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `scope` | Named storage root. |
| `path` | Relative JSON filename. |
| `missing` | Value returned when the file does not exist. |
| `project` | Project name; empty selects the active project. |

## Returns

Parsed JSON; corrupt and unreadable files throw.
