---
title: "SDK_API::requestInterfaceUi"
summary: "Opens or updates a named interface workflow without blocking the plugin loop. The returned object contains a request_id which can be queried for its typed JSON result."
---

## Declaration

```cpp
virtual nlohmann::json requestInterfaceUi(
            const std::string& ui_id,
            nlohmann::json payload,
            nlohmann::json options = nlohmann::json::object()) {
            (void)ui_id;
            (void)payload;
            (void)options;
            return nlohmann::json::object();
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `ui_id` | Plugin-local interface workflow identifier. |
| `payload` | Workflow request payload. |
| `options` | Optional workflow settings; severity is message (default), warning, or error. |
