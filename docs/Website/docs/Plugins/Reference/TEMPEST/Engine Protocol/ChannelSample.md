---
title: "ChannelSample"
summary: "One channel value with its RAPID timestamp in nanoseconds."
---

## API

One channel value with its RAPID timestamp in nanoseconds.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelSample {
    Value value;
    uint64_t timestamp = 0;
};
```
