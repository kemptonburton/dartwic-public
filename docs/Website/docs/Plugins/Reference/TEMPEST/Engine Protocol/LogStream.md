---
title: "LogStream"
summary: "Identifies one originating node, process session, and named log source."
---

## API

Identifies one originating node, process session, and named log source.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineTypes.h>
```

## Declaration

```cpp
struct LogStream {
    std::string owner_node;
    std::string session;
    std::string stream;
};
```
