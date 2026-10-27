---
title: SDK_API::overrideChannelAuthorityOnly
summary: Acquire an automatic override without writing. Remote targets and callers without an eligible owner use ordinary upsert when a value is supplied, or no-op without one.
created: 2026-10-26T18:30
updated: 2026-10-26T19:26
---

## Declaration

```cpp
void overrideChannel(const std::string& channel) { applyAuthorityByName(2, channel, std::nullopt); }
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Channel name or node-qualified remote channel. |
