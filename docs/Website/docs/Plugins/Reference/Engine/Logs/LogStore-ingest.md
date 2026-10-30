---
title: LogStore::ingest
summary: Accepts a peer-owned record while preserving its node, session, and sequence. The recording worker ignores already stored identities. Late unseen sequences remain eligible even after newer live records were admitted. No storage lookup or subscriber callback runs in this admission call.
created: 2026-10-04T18:31
updated: 2026-10-28T20:30
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

Whether the record was accepted for asynchronous recording/deduplication.
