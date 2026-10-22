---
title: "LogStore::ingest"
summary: "Accepts a peer-owned record while preserving its node, session, and sequence. Replayed records with an existing sequence are ignored."
---

## Declaration

```cpp
bool ingest(LogRecord record);
```

## Parameters

| Name | Description |
| --- | --- |
| `record` | Complete peer-owned record. |

## Returns

Whether the record was accepted or had already been seen.
