---
title: "fromValue"
summary: "Convert application values to JSON at an optional adapter boundary."
---

## API

Convert application values to JSON at an optional adapter boundary. Reject nonfinite doubles. Messaging and EngineProtocol never depend on this helper.

Namespace: `TEMPEST::Json`.

```cpp
#include <tempest/JsonValue.h>
```

## Declaration

```cpp
inline nlohmann::json fromValue(const Value& value);
```
