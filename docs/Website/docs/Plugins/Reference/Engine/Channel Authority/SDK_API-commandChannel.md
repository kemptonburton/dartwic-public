---
title: SDK_API::commandChannel
summary: Acquires automatic ownership and writes atomically for an eligible local runtime. Remote targets or callers without runtime authority use an ordinary upsert. Rejection preserves authority and value; remote submission only confirms queueing.
created: 2026-08-04T17:38
updated: 2026-10-26T19:04
---

## Declaration

```cpp
virtual void commandChannel(const std::string& channel, ChannelValue value) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel name. |
| `value` | Commanded value. |
