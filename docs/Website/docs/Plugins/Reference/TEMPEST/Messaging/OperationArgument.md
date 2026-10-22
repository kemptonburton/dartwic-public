---
title: "OperationArgument"
summary: "Metadata for a callable operation."
---

## API

Metadata for a callable operation. Payload values remain codec independent.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Peer.h>
```

## Declaration

```cpp
struct OperationArgument {
    std::string name;
    std::string type;
    std::string description;
    bool required = false;
    std::optional<Value> default_value;
    std::vector<Value> choices;
};
```
