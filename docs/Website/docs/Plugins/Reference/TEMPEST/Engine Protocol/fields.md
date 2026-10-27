---
title: "fields"
summary: "Encode supplied channel fields without inventing omitted values."
---

## API

Encode supplied channel fields without inventing omitted values.

Namespace: `DARTWIC::EngineContract`.

```cpp
#include <dartwic/EngineProtocol.h>
```

## Declaration

```cpp
Value::Object fields(const ChannelFields &fields);
ChannelFields fields(const Value::Object &fields);
```
