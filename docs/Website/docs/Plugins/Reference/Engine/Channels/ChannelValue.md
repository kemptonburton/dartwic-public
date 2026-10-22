---
title: "ChannelValue"
summary: "Value types accepted by channel read, write, and authority APIs."
---

## Declaration

```cpp
using ChannelValue = std::variant<double, int, std::string, bool, RecordMode, ControlPolicy,
        std::vector<ChannelValueOption>, std::vector<ChannelCalculationLink>, StartupValue>;
```
