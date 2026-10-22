---
title: "LogStore::write"
summary: "Appends local text to a named stream in the current engine session. ARGUS supplies the node, session, timestamp, and sequence. Returns false when the bounded queue cannot accept the text. No event is created."
---

## Declaration

```cpp
bool write(std::string stream, std::string text, std::string channel = "stdout",
               std::string level = "info");
```

## Parameters

| Name | Description |
| --- | --- |
| `stream` | Source name, such as `Engine` or `DARTWIC BUILDER`. |
| `text` | Text to append; a trailing newline is optional. |
| `channel` | `stdout` or `stderr`. |
| `level` | `info`, `warning`, or `error`. |

## Returns

Whether the text was accepted for asynchronous writing.

## Example

```cpp
argus.logs().write("Flight Computer", "Telemetry link ready\n");
```
