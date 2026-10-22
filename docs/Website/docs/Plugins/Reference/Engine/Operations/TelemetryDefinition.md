---
title: "TelemetryDefinition"
summary: "Declares an operator-visible telemetry topic before its first publication."
---

## Declaration

```cpp
struct TelemetryDefinition {
        std::string id;
        std::string name;
        std::string description;
        std::string delivery;
    };
```
