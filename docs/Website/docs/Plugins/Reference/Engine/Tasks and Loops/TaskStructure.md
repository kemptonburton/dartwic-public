---
title: "TaskStructure"
summary: "Execution shape used by a registered task type."
---

## Declaration

```cpp
enum class TaskStructure {
        Unknown,
        Periodic,
        StateMachine,
        Sequence,
        Timeline,
        Worker
    };
```
