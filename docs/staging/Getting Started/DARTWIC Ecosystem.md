---
updated: 2026-06-23T04:39
created: 2026-06-23
---

DARTWIC is an ecosystem of runtime services, operator surfaces, scripts, plugins, and clients that all work against the same live system model.

# Main Pieces

| Piece | What It Does | Read More |
| --- | --- | --- |
| Engine | Hosts RAPID channels, CAESAR tasks, ARGUS events, TEMPEST communications, modules, plugins, scripting, and persistence. | [Engine Overview](../Engine/Overview.md) |
| Interface | Gives operators a visual workspace for channel search, schematics, tasks, ARGUS events, exporters, plugins, and settings. | [Interface Overview](../Interface/Overview.md) |
| RAPID Share | Connects remote engines, driver runtimes, and remote nodes into the local operator workspace. | [RAPID Share and Remote Nodes](../Engine/RAPID%20Share%20and%20Remote%20Nodes.md) |
| DCode | Lets teams write easy automation logic using channels already available in DARTWIC. | [DCode Overview](../DCode/Overview.md) |
| Modules | Custom C++ runtime lifecycle for device drivers, protocol integrations, external data sources, and plugin-owned engine services. | [Modules](../Engine/Modules.md) |
| Plugins | Package engine modules, interface pages, resources, schematic nodes, task types, and SDK extensions. | [Plugins Overview](../Plugins/Overview.md) |
| Clients | External Python and React libraries that call engine operations and subscribe to live state. | [Python Client](../Clients/Python%20Client.md) |

# How Data Moves

1. Engine modules, DCode tasks, plugin task types, clients, or engine code publish channel data.
2. RAPID stores latest values and records history when `record_mode` allows it.
3. The interface and clients read channels, diagnostics, task state, events, and history through TEMPEST.
4. RAPID Share can bring remote runtime state into the same operator workspace.
5. Commands flow back through RAPID channel writes or explicit engine operations.
6. ARGUS records notable runtime conditions and operator interactions.

# How To Think About Builds

- Use a module when DARTWIC needs to talk to something outside itself, such as a PLC, device, simulator, database, or service.
- Use DCode when the data is already in DARTWIC and you need automation logic over those channels.
- Use an interface plugin when operators need a better workflow than raw channel browsing.
- Use a client when an external script, dashboard, or app needs to connect to a running engine.
- Use RAPID Share when another DARTWIC engine, driver runtime, or remote node should appear in the local workspace.

# Related Reading

- [Channels](../Engine/Channels.md)
- [Commanding and Control](../Engine/Commanding%20and%20Control.md)
- [RAPID Share and Remote Nodes](../Engine/RAPID%20Share%20and%20Remote%20Nodes.md)
- [DCode and Scripting](../Engine/DCode%20and%20Scripting.md)
- [First Engine Plugin](../Plugins/First%20Engine%20Plugin.md)
- [First Interface Plugin](../Plugins/First%20Interface%20Plugin.md)
