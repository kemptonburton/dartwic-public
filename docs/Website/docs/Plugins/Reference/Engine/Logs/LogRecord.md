---
title: "LogRecord"
summary: "A single timestamped entry in an ARGUS stream."
---

## Declaration

```cpp
struct LogRecord {
    std::string node;
    std::string session;
    std::string stream;
    std::string channel = "stdout";
    std::string level = "info";
    std::string text;
    uint64_t sequence = 0;
    uint64_t timestamp_ns = 0;
};
```
