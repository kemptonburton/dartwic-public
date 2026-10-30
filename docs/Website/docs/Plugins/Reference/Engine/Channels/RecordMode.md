---
title: RecordMode
summary: Controls when channel values are recorded to persistence. EveryValueExcludeAutorecord records every accepted sample (including equal values and timestamped batches) and skips periodic snapshots; requires Engine 2.1.0.
created: 2026-08-04T17:38
updated: 2026-10-29T21:06
---

## Declaration

```cpp
enum class RecordMode {
        OnValueChange,
        Never,
        EveryValue,
        EveryValueExcludeAutorecord
    };
```
