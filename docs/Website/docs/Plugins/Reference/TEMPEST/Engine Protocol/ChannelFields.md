---
title: "ChannelFields"
summary: "Optional fields; omitted values leave existing data unchanged."
---

## API

Optional fields; omitted values leave existing data unchanged. Extra observation fields are read-only.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelFields {
    std::optional<Value> value;
    std::optional<uint64_t> timestamp;
    std::optional<std::string> units;
    std::optional<double> stale_timeout;
    std::optional<std::string> record_mode;
    std::optional<Value> calculation_scripts;
    std::optional<Value> value_options;
    std::optional<Value> startup_value;
    Value::Object extra;
};
```
