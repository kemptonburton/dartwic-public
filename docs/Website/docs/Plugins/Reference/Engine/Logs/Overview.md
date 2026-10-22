---
title: "Logs"
summary: "Write, query, and share timestamped ARGUS text streams without creating operator events."
---

| Declaration | Description |
| --- | --- |
| [LogStore::ingest](LogStore-ingest.md) | Accepts a peer-owned record while preserving its node, session, and sequence. |
| [LogStore::listStreams](LogStore-listStreams.md) | Lists available stream/session pairs for one node or all nodes. |
| [LogLimits](LogLimits.md) | Rotation and retention limits for a local log store. |
| [LogRecord](LogRecord.md) | A single timestamped entry in an ARGUS stream. |
| [LogStore::query](LogStore-query.md) | Reads a bounded page filtered by node, session, stream, text, channel, |
| [LogStore::write](LogStore-write.md) | Appends local text to a named stream in the current engine session. |
| [SDK_API::writeLog](SDK_API-writeLog.md) | Appends text to an ARGUS log stream without creating an operator event. |
