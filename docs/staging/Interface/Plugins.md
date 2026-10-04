---
updated: 2026-06-23
created: 2026-06-23
---

Plugins can add interface pages, resources, schematic nodes, module configuration pages, and project-specific workflows.

# What Operators See

- plugin resources in the workspace
- module configuration pages
- custom schematic nodes
- settings or workflow pages supplied by a plugin
- controls and displays that hide low-level channel details behind a purpose-built UI

# What Builders Should Link

If a plugin exposes engine modules, the interface docs for that plugin should explain:

- which module instance it configures
- which channels the module publishes
- which channels are command targets
- which resources or schematic nodes operators should use
- which settings affect runtime behavior

# Read More

- [Plugins Overview](../Plugins/Overview.md)
- [Creating a Plugin](../Plugins/Creating%20a%20Plugin.md)
- [First Interface Plugin](../Plugins/First%20Interface%20Plugin.md)
- [First Engine Plugin](../Plugins/First%20Engine%20Plugin.md)
- [Modules](../Engine/Modules.md)
