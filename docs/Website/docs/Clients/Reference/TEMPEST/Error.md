---
title: "Error"
summary: "Base messaging failure."
---

## API

Base messaging failure.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Peer.h>
```

## Declaration

```cpp
class Error : public std::runtime_error {
public:
    using std::runtime_error::runtime_error;
};
```
