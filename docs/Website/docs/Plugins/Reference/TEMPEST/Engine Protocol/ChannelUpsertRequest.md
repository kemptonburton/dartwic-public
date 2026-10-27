---
title: "ChannelUpsertRequest"
summary: "Owner-directed batch; execution is synchronous but not atomic."
---

## API

Owner-directed batch; execution is synchronous but not atomic. Engine authority context is separate from writable fields.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct ChannelUpsertRequest {
    ChannelChanges changes;
    std::string command_origin;
    std::string automation_operation;
    bool take_manual_control = false;
    bool release_manual_override = false;
};
```
