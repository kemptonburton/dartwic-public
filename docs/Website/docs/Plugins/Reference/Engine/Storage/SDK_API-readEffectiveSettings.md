---
title: "SDK_API::readEffectiveSettings"
summary: "Returns effective policy plus its workspace/project overrides and sources."
---

## Declaration

```cpp
virtual nlohmann::json readEffectiveSettings(const nlohmann::json& defaults = nlohmann::json::object(), const std::string& project = "") {
            throw std::runtime_error("Settings helpers are unavailable in this host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `defaults` | Caller defaults overlaid by portable policy. |
| `project` | Project name; empty selects the active project. |

## Returns

Effective settings, stored layers, leaf sources and revision.
