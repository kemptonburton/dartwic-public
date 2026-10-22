---
title: OperationDescriptor
summary: A peer-visible command with typed argument metadata.
created: 2026-09-26T14:51
updated: 2026-10-04T04:52
---

## API

A peer-visible command with typed argument metadata.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Peer.h>
```

## Declaration

```cpp
struct OperationDescriptor {
    std::string name;
    std::string display_name;
    std::string description;
    std::string category;
    std::vector<OperationArgument> arguments;
    std::string plugin_id;
    AllowedRoles allowed_roles = AllowedRoles::AdminOnly;
};
```
