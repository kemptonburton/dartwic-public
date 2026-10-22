---
title: "TaskLoopFunction"
summary: "Callback used for repeated task execution with elapsed seconds."
---

## Declaration

```cpp
using TaskLoopFunction = std::function<void(const TaskTypeDefinition&, TaskRuntime&, double)>;
```
