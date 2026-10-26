---
title: "taskArgument"
summary: "Typed task argument access during configuration. Missing values use the default; malformed values throw with the argument name. Not intended for periodic callbacks."
---

## Declaration

```cpp
template<class T> T taskArgument(const TaskRuntime& runtime, const std::string& key, T fallback = T{}) {
    const auto& arguments = runtime.getArguments();
    if (!arguments.contains(key)) return fallback;
    try { return arguments.at(key).get<T>(); }
    catch (const std::exception& error) { throw std::runtime_error("Invalid task argument `" + key + "`: " + error.what()); }
}
```
