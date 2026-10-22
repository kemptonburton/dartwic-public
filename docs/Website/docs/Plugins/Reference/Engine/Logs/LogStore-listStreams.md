---
title: "LogStore::listStreams"
summary: "Lists available stream/session pairs for one node or all nodes."
---

## Declaration

```cpp
nlohmann::json listStreams(const std::string& node = {}) const;
```

## Parameters

| Name | Description |
| --- | --- |
| `node` | Optional originating node name. |

## Returns

Stream and session names with the latest stored timestamp.
