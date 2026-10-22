---
title: "SDK_API::callTempest"
summary: "Calls a registered TEMPEST operation on the current node or a connected peer. Payloads use JSON at the engine SDK boundary; peers use Value. A remote timeout reports unknown completion and never retries the operation."
---

## Declaration

```cpp
virtual nlohmann::json callTempest(const std::string& node, const std::string& operation,
                                           const nlohmann::json& payload) {
            throw std::runtime_error("TEMPEST peer calls are unavailable in this SDK host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `node` | Current engine node name or connected remote node name. |
| `operation` | Fully qualified operation name, such as fprime/command. |
| `payload` | Operation arguments. |

## Returns

The operation result; throws on local failure, disconnection, timeout, or remote failure.
