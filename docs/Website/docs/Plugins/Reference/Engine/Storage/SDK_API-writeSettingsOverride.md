---
title: "SDK_API::writeSettingsOverride"
summary: "Merges a portable settings override; reset contains JSON pointers to remove."
---

## Declaration

```cpp
virtual nlohmann::json writeSettingsOverride(const std::string& scope, const nlohmann::json& patch,
            const nlohmann::json& reset = nlohmann::json::array(), const std::string& project = "", const std::string& revision = "") {
            throw std::runtime_error("Settings helpers are unavailable in this host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `scope` | workspace or project. |
| `patch` | Intentional settings overrides. |
| `reset` | JSON pointers to remove from this scope. |
| `project` | Project name; empty selects the active project. |
| `revision` | Optional revision token to reject stale edits. |

## Returns

Updated settings snapshot without caller defaults.
