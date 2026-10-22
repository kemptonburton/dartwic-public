---
title: "DCodeFunctionArgument"
summary: "Describes one input or output in a plugin-provided DCode function."
---

## Declaration

```cpp
struct DCodeFunctionArgument {
        std::string name;
        std::string type;
        std::string doc;
        bool required = false;
        // Fixed list size and named dictionary fields are used by prepared
        // native calls; ordinary Lua values may still grow when unshaped.
        std::optional<size_t> list_length;
        std::shared_ptr<DCodeFunctionArgument> element;
        std::vector<DCodeFunctionArgument> fields;
    };
```
