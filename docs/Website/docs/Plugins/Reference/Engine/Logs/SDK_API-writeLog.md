---
title: "SDK_API::writeLog"
summary: "Appends text to an ARGUS log stream without creating an operator event. Plugin calls use a plugin-qualified stream name, such as `ethercat/Bus`. The engine supplies the node, session, timestamp, and sequence. Writes are asynchronous and return false if the bounded queue is full."
---

## Declaration

```cpp
virtual bool writeLog(const std::string& stream, const std::string& text,
            const std::string& channel = "stdout", const std::string& level = "info") {
            (void)stream;
            (void)text;
            (void)channel;
            (void)level;
            return false;
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `stream` | Plugin-local stream name, such as `Bus`. |
| `text` | Text to append; a trailing newline is optional. |
| `channel` | `stdout` or `stderr` for console-style coloring. |
| `level` | `info`, `warning`, or `error` for filtering. |

## Returns

Whether ARGUS accepted the text for writing.

## Example

```cpp
api.writeLog("Bus", "Device connected", "stdout", "info");
```
