---
title: "SDK_API::upsertChannelValueBulk"
summary: "Writes timestamped numeric samples to one channel in a single call."
---

## Declaration

```cpp
virtual void upsertChannelValueBulk(const std::string& channel,
            const std::vector<std::pair<double, uint64_t>>& data) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `channel` | Channel receiving the samples. |
| `data` | Value and Unix-nanosecond timestamp pairs. |
