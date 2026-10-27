---
title: SDK_API::freeChannel
summary: Releases all of the local caller's claims without writing a value. Other controllers and operator control remain. No eligible caller or remote target is a no-op.
created: 2026-08-04T17:38
updated: 2026-10-26T19:04
---

## Declaration

```cpp
virtual void freeChannel(const std::string& channel) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Flat channel name. |
