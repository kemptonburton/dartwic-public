---
title: SDK_API::overrideChannel
summary: Acquire an automatic override and write atomically. Remote targets and callers without an eligible owner use ordinary upsert when a value is supplied, or no-op without one.
created: 2026-10-26T18:30
updated: 2026-10-26T19:26
---

## Declaration

```cpp
void overrideChannel(const std::string& channel, ChannelValue value) { applyAuthorityByName(2, channel, std::move(value)); }
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Channel name or node-qualified remote channel. |
| `value` | Requested numeric value, subject to current channel protection. |
