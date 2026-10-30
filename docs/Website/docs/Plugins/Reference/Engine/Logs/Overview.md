---
title: Logs
summary: Write, query, and share timestamped ARGUS text streams without creating operator events.
created: 2026-10-04T18:31
updated: 2026-10-28T18:15
---

| Declaration | Description |
| --- | --- |
| [LogStore::ingest](LogStore-ingest.md) | Accepts a peer-owned record while preserving its node, session, and sequence. |
| [LogStore::listStreams](LogStore-listStreams.md) | Lists available stream/session pairs for one node or all nodes. |
| [SDK_API::log](SDK_API-log.md) | Appends an info line to a plugin-local ARGUS stream. |
| [SDK_API::log_error](SDK_API-log_error.md) | Appends an error line without creating an operator event. |
| [SDK_API::log_warning](SDK_API-log_warning.md) | Appends a warning line without creating an operator event. |
| [LogLimits](LogLimits.md) | Rotation and retention limits for a local log store. |
| [LogRecord](LogRecord.md) | A single timestamped entry in an ARGUS stream. |
| [LogStore::query](LogStore-query.md) | Reads a bounded page filtered by node, session, stream, text, channel, |
| [LogStore::write](LogStore-write.md) | Appends local text to a named stream in the current engine session. |
| [SDK_API::writeLog](SDK_API-writeLog.md) | Appends text to an ARGUS log stream without creating an operator event. |
