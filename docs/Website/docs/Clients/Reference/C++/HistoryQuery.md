---
title: HistoryQuery
summary: Recorded-data query options. Timestamps are inclusive Unix nanoseconds; omit bounds to query available history subject to server limits.
created: 2026-10-04T18:31
updated: 2026-10-14T22:39
---

Namespace: `DARTWIC::Client`.

```cpp
#include <dartwic/DartwicClient.h>
```

## Declaration

```cpp
struct HistoryQuery {
    std::optional<std::uint64_t> from;
    std::optional<std::uint64_t> to;
    std::optional<std::size_t> bucket_count;
    std::string bucket_mode = "average";
    std::chrono::milliseconds timeout{10000};
};
```
