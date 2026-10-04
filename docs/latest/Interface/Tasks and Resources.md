---
updated: 2026-06-23T04:39
created: 2026-06-23
---

Tasks and resources are how the interface turns engine behavior into operator workflows.

# Tasks In The Interface

Tasks expose runtime state and controls in a consistent shape. Depending on the task, operators may be able to:

- start or stop execution
- hold and release execution
- inspect actual frequency
- set target frequency
- inspect current state
- request target state

Use task controls when they exist. They usually express the intended workflow better than editing lower-level channels directly.

# Resources

Resources are plugin-provided pages, tools, and file-backed workflows. They are useful when a workflow does not belong in the main task model.

Resources are good for:

- custom operator pages
- project-specific tooling
- file-backed workflows
- small utilities
- focused plugin actions

Core interface resources include schematics, scripts, checklists, dataframes, module pages, Cluster Map, and ARGUS events. Plugins can add more resources when a project needs a workflow that does not fit the built-in pages.

# Public Expectations

A good resource should be easy to discover and focused on one job. Operators should not need to understand the whole plugin system to use a resource page safely.

# Related Reading

- [Engine Tasks](../Engine/Tasks.md)
- [Managing Tasks](Managing%20Tasks.md)
- [Checklists](Checklists.md)
- [DataFrames](DataFrames.md)
- [Cluster Map](Cluster%20Map.md)
- [Plugins](Plugins.md)
- [Resources Reference](../Plugins/Reference/Interface/Resources.md)
- [First Interface Plugin](../Plugins/First%20Interface%20Plugin.md)
