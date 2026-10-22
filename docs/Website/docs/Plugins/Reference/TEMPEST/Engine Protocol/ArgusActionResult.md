---
title: "ArgusActionResult"
summary: "Event identity and result fields returned by an ARGUS action handler."
---

## API

Event identity and result fields returned by an ARGUS action handler.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ArgusActionResult {
    std::string event_id;
    Value::Object result;
};
```
