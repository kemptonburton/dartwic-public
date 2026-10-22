---
title: "Value"
summary: "Application values independent of encoding: null, bool, exact signed/unsigned 64-bit integers, double, string, array, or object."
---

## API

Application values independent of encoding: null, bool, exact signed/unsigned 64-bit integers, double, string, array, or object.

Namespace: `TEMPEST`.

```cpp
#include <tempest/Value.h>
```

## Declaration

```cpp
class Value {
public:
    using Array = std::vector<Value>;
    using Object = std::map<std::string, Value>;
    using Storage = std::variant<std::monostate, bool, int64_t, uint64_t, double,
                                     std::string, Array, Object>;
    Value() = default;
    Value(std::nullptr_t);
    Value(bool v);
    Value(int v);
    Value(int64_t v);
    Value(uint64_t v);
    Value(double v);
    Value(const char* v);
    Value(std::string v);
    Value(Array v);
    Value(Object v);
    const Storage& storage() const noexcept;
    Storage& storage() noexcept;
    bool isNull() const noexcept;
    const Object& object() const;
    const Array& array() const;
    const std::string& string() const;
    const Value& at(const std::string& key) const;
    friend bool operator==(const Value&, const Value&) = default;
};
```
