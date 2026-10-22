---
title: "TaskCleanupFunction"
summary: "Callback used to release runtime state after task execution ends."
---

## Declaration

```cpp
using TaskCleanupFunction = std::function<void(TaskRuntime&)>;
```
