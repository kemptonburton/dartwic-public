---
title: "TaskTypeMetadata"
summary: "Identity, structure, presentation, and defaults for a plugin task type."
---

## Declaration

```cpp
struct TaskTypeMetadata {
        std::string task_type;
        TaskStructure structure = TaskStructure::Unknown;
        std::string icon_url;
        std::string exposed_from;
        std::string expected_plugin_id;
        nlohmann::json default_arguments = nlohmann::json::object();
    };
```
