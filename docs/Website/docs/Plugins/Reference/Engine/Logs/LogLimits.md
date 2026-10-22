---
title: "LogLimits"
summary: "Rotation and retention limits for a local log store."
---

## Declaration

```cpp
struct LogLimits {
    uintmax_t segment_bytes = 64ull * 1024 * 1024;
    uintmax_t node_bytes = 1ull * 1024 * 1024 * 1024;
    uintmax_t project_bytes = 10ull * 1024 * 1024 * 1024;
    unsigned retention_days = 0;
};
```
