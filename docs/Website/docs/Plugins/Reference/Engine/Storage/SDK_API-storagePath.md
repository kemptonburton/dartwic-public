---
title: "SDK_API::storagePath"
summary: "Resolves a local path below a named root."
---

## Declaration

```cpp
virtual std::string storagePath(const std::string& scope, const std::string& relative,
                                        const std::string& project = "") {
            throw std::runtime_error("Storage path helpers are unavailable in this host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `scope` | installation, instance, workspace, project, settings, runtime or cache. |
| `relative` | Relative path below the selected root. |
| `project` | Project name; empty selects the active project. |

## Returns

Absolute path on the engine computer.
