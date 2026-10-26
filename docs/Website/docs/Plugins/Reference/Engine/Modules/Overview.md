---
title: Modules
summary: Define module types and access their active runtime instances.
created: 2026-08-04T17:38
updated: 2026-10-25T12:52
---

| Declaration | Description |
| --- | --- |
| [BaseModule](BaseModule.md) | Base class for a long-lived module instance created by an engine plugin. |
| [SDK_API::getModuleInstance](SDK_API-getModuleInstance.md) | Returns a live module instance by configured instance name. |
| [SDK_API::getModuleInstances](SDK_API-getModuleInstances.md) | Lists live module instances, optionally limited to one plugin. |
| [ModuleInstanceSummary](ModuleInstanceSummary.md) | Lightweight identity returned when enumerating live module instances. |
| [ModuleTypeDefinition](ModuleTypeDefinition.md) | Declares a module type that a plugin can instantiate. |
| [SDK_API::registerModuleType](SDK_API-registerModuleType.md) | Registers a plugin-local module type and returns its qualified identifier. |
| [taskModule](taskModule.md) | Resolves and retains a module at configuration time; rejects unavailable or |
| [TaskModuleBindings](TaskModuleBindings.md) | Plugin-owned, configuration-only task/module association helper. bind wraps |
