---
title: "SDK_API::commandChannelAuthorityOnly"
summary: "Acquire automatic ownership without writing. Remote targets and callers without an eligible owner use ordinary upsert when a value is supplied, or no-op without one."
---

## Declaration

```cpp
void commandChannel(const std::string& channel) { applyAuthorityByName(0, channel, std::nullopt); }
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Channel name or node-qualified remote channel. |
