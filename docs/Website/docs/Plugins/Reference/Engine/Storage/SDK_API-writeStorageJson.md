---
title: "SDK_API::writeStorageJson"
summary: "Atomically saves JSON below a storage root."
---

## Declaration

```cpp
virtual void writeStorageJson(const std::string& scope, const std::string& path,
            const nlohmann::json& value, const std::string& project = "") {
            throw std::runtime_error("JSON storage helpers are unavailable in this host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `scope` | Named storage root. |
| `path` | Relative JSON filename. |
| `value` | JSON document to save. |
| `project` | Project name; empty selects the active project. |
