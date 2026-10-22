---
title: "LogStore::query"
summary: "Reads a bounded page filtered by node, session, stream, text, channel, level, sequence cursor, or timestamp range (`from_ns` and `to_ns`)."
---

## Declaration

```cpp
nlohmann::json query(const nlohmann::json& selector) const;
```

## Parameters

| Name | Description |
| --- | --- |
| `selector` | JSON query; `before` and `after` are sequence cursors. |

## Returns

Records, count, continuation cursor, and dropped-write count.
