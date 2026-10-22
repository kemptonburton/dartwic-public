---
title: "toObject"
summary: "Convert a JSON object to an application object, rejecting other JSON types."
---

## API

Convert a JSON object to an application object, rejecting other JSON types.

Namespace: `TEMPEST::Json`.

```cpp
#include <tempest/JsonValue.h>
```

## Declaration

```cpp
inline Value::Object toObject(const nlohmann::json& value);
```
