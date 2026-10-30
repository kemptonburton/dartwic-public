---
title: "SDK_API::log"
summary: "Appends an info line to a plugin-local ARGUS stream."
---

## Declaration

```cpp
bool log(const std::string& stream, const std::string& text) {
            return writeLog(stream, text + "\n", "stdout", "info");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `stream` | Plugin-local stream name. |
| `text` | Message; this helper appends a newline. |

## Returns

Asynchronous recording admission, not persistence or delivery.

## Example

```cpp
api.log("Bus", "Device connected");
```
