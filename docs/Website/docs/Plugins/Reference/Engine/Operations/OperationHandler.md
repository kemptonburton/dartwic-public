---
title: "OperationHandler"
summary: "Handler for a plugin-defined TEMPEST extension operation."
---

Plugin-defined operations are not part of the official DARTWIC operation catalog.

## Declaration

```cpp
using OperationHandler = std::function<nlohmann::json(const nlohmann::json& payload)>;
```
