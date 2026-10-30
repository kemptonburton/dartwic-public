---
title: "SDK_API::log_warning"
summary: "Appends a warning line without creating an operator event."
---

## Declaration

```cpp
bool log_warning(const std::string& stream, const std::string& text) {
            return writeLog(stream, text + "\n", "stdout", "warning");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `stream` | Plugin-local stream name. |
| `text` | Message; this helper appends a newline. |

## Returns

Asynchronous recording admission; formatting may allocate.
