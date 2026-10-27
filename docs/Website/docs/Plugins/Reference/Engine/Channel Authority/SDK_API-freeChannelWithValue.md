---
title: SDK_API::freeChannelWithValue
summary: Write a final value and release all of the caller's claims atomically. Remote targets and callers without an eligible owner use ordinary upsert when a value is supplied, or no-op without one.
created: 2026-10-26T18:30
updated: 2026-10-26T19:26
---

## Declaration

```cpp
void freeChannel(const std::string& channel, ChannelValue value) { applyAuthorityByName(3, channel, std::move(value)); }
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Channel name or node-qualified remote channel. |
| `value` | Requested numeric value, subject to current channel protection. |
