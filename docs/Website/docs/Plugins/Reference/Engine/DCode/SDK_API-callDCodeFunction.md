---
title: "SDK_API::callDCodeFunction"
summary: "Calls a registered native DCode function with a JSON payload."
---

## Declaration

```cpp
virtual nlohmann::json callDCodeFunction(const std::string& function_name, const nlohmann::json& payload) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `function_name` | Qualified or built-in function name. |
| `payload` | Function arguments encoded as JSON. |

## Returns

Function result encoded as JSON.
