---
title: "C++ Client Reference"
summary: "C++20 DARTWIC client with bundled TEMPEST and a CMake DARTWIC::Client target."
---

| API | Description |
| --- | --- |
| [ClientConfig](ClientConfig.md) | Engine connection settings. Requires C++20; construction does not open sockets. |
| [HistoryQuery](HistoryQuery.md) | Recorded-data query options. Timestamps are inclusive Unix nanoseconds; omit bounds to query available history subject to server limits. |
| [DartwicClient](DartwicClient.md) | DARTWIC convenience API over the bundled TEMPEST client. Operations may run concurrently; lifecycle calls must be serialized by the caller. |
