---
title: Tasks and Loops
summary: Define task types, lifecycle callbacks, and CAESAR-controlled loop behavior.
created: 2026-08-04T17:38
updated: 2026-10-25T12:52
---

| Declaration | Description |
| --- | --- |
| [PluginLoopDefinition](PluginLoopDefinition.md) | Lifecycle callbacks and optional target frequency for a plugin-owned loop. |
| [SDK_API::registerLoop](SDK_API-registerLoop.md) | Registers a CAESAR-controlled plugin loop and returns its qualified identifier. |
| [SDK_API::registerTaskType](SDK_API-registerTaskType.md) | Registers a plugin-local task type and returns its qualified identifier. |
| [taskArgument](taskArgument.md) | Typed task argument access during configuration. Missing values use the default; |
| [TaskCleanupFunction](TaskCleanupFunction.md) | Callback used to release runtime state after task execution ends. |
| [TaskLifecycleFunction](TaskLifecycleFunction.md) | Callback used for task start and end lifecycle phases. |
| [TaskLoopFunction](TaskLoopFunction.md) | Callback used for repeated task execution with elapsed seconds. |
| [TaskRuntime](TaskRuntime.md) | Live task context passed to plugin task lifecycle callbacks. |
| [TaskStructure](TaskStructure.md) | Execution shape used by a registered task type. |
| [TaskTypeDefinition](TaskTypeDefinition.md) | Complete registration definition for a plugin task type. |
| [TaskTypeMetadata](TaskTypeMetadata.md) | Identity, structure, presentation, and defaults for a plugin task type. |
