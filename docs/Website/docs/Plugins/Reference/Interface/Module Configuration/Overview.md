---
title: "Module Configuration"
summary: "Provide configuration panels and definitions for engine module instances."
---

| Export | Import path | Description |
| --- | --- | --- |
| [defineModuleConfig](defineModuleConfig.md) | `@dartwic/interface-sdk/module-configs` | Defines a module instance configuration component. |
| [ModuleConfigBridgeState](ModuleConfigBridgeState.md) | `@dartwic/interface-sdk/module-configs` | State published to the host by `useModuleConfigBridge`. |
| [ModuleConfigDefinition](ModuleConfigDefinition.md) | `@dartwic/interface-sdk/module-configs` | Component registered as a module configuration editor. |
| [ModuleConfigProps](ModuleConfigProps.md) | `@dartwic/interface-sdk/module-configs` | Props passed to a module configuration component. |
| [ModuleConfigRegistration](ModuleConfigRegistration.md) | `@dartwic/interface-sdk/module-configs` | Bridge exposed by the host module editor to a plugin configuration component. |
| [ModuleConnectionDefinition](ModuleConnectionDefinition.md) | `@dartwic/interface-sdk` | Static or instance-derived live connection presentation for a module. |
| [ModuleConnectionPresentation](ModuleConnectionPresentation.md) | `@dartwic/interface-sdk` | Optional live connection presentation used by module headers and resource navigation. |
| [ModuleUiDefinition](ModuleUiDefinition.md) | `@dartwic/interface-sdk` | Registers icon and panel components for a module type. |
| [useModuleConfigBridge](useModuleConfigBridge.md) | `@dartwic/interface-sdk/module-configs` | Synchronizes save, dirty, and validation state with the host module header. |
