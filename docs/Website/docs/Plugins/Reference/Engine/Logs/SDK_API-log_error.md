---
title: "SDK_API::log_error"
summary: "Appends an error line without creating an operator event."
---

## Declaration

```cpp
bool log_error(const std::string& stream, const std::string& text) {
            return writeLog(stream, text + "\n", "stderr", "error");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `stream` | Plugin-local stream name. |
| `text` | Message; this helper appends a newline. |

## Returns

Asynchronous recording admission; formatting may allocate.
