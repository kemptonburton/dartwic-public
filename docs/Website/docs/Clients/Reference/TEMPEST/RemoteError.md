---
title: "RemoteError"
summary: "Remote operation failure with a machine-readable code."
---

## API

Remote operation failure with a machine-readable code.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Peer.h>
```

## Declaration

```cpp
class RemoteError : public Error {
public:
    RemoteError(std::string message, std::string code);
    const std::string& code() const noexcept;
};
```
