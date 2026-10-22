---
title: "ArgusAction"
summary: "Action on an ARGUS event."
---

## API

Action on an ARGUS event. Kind selects a built-in action or a custom operation and payload.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusAction {
    enum class Kind { Respond, UpdateStatus, ReleaseHold, Delete, Custom };
    Kind kind = Kind::Custom;
    std::string event_id;
    std::string operation;
    Value::Object payload;
};
```
