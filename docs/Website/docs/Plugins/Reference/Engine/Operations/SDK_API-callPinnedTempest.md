---
title: "SDK_API::callPinnedTempest"
summary: "Calls a saved pinned operation on the current engine or a connected remote node once."
---

## Declaration

```cpp
virtual nlohmann::json callPinnedTempest(const std::string& node, const std::string& preset,
                                                  const nlohmann::json& overrides = nlohmann::json::object()) {
            throw std::runtime_error("Pinned TEMPEST peer calls are unavailable in this SDK host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `node` | Current engine node name or connected remote node name. |
| `preset` | Stable pinned-operation ID or unambiguous label for that node. |
| `overrides` | Object merged over saved operation arguments. |

## Returns

Operation result; throws if the preset is missing, ambiguous, or invocation fails.
