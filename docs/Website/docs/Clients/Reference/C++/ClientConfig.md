---
title: "ClientConfig"
summary: "Engine connection settings. Requires C++20; construction does not open sockets."
---

Namespace: `DARTWIC::Client`.

```cpp
#include <dartwic/DartwicClient.h>
```

## Declaration

```cpp
struct ClientConfig {
    std::string host = "127.0.0.1";
    int port = 7000;
    std::string password;
};
```
