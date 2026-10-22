---
title: "TaskTypeDefinition"
summary: "Complete registration definition for a plugin task type."
---

## Declaration

```cpp
struct TaskTypeDefinition {
        TaskTypeMetadata metadata;
        TaskLifecycleFunction on_configure;
        TaskLifecycleFunction on_start;
        TaskLoopFunction on_task;
        TaskMissedFunction on_missed;
        TaskLifecycleFunction on_end;
        TaskCleanupFunction cleanup;
        // Suppress timing warnings; scheduling, measurements and callback errors remain active.
        void setDisableWarnings(bool disabled = true) {
            metadata.default_arguments["disable_warnings"] = disabled;
        }
    };
```
